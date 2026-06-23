import { createClient } from "@/src/lib/supabase/server";
import { getCategoryBySlug } from "@/src/lib/storefront/categories";
import { getAvailableStockByVariantIds } from "@/src/lib/storefront/inventory";
import { getProductImagePublicUrl } from "@/src/lib/supabase/storage";
import {
  STOREFRONT_FEATURED_PRODUCTS_LIMIT,
  STOREFRONT_PRODUCTS_PAGE_SIZE,
  STOREFRONT_RELATED_PRODUCTS_LIMIT,
  type StorefrontCatalogResult,
  type StorefrontProductCard,
  type StorefrontProductDetail,
} from "@/src/lib/storefront/types";

type ProductRecord = {
  id: string;
  primary_category_id: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  brand: string | null;
  status: string;
  created_at: string;
};

type VariantRecord = {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  unit: string | null;
  is_active: boolean | null;
};

type ImageRecord = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
};

function normalizeSearch(value: string) {
  return value.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ");
}

function buildProductSearchFilter(search: string, productIds: string[]) {
  const filters = [
    `name.ilike.%${search}%`,
    `slug.ilike.%${search}%`,
    `brand.ilike.%${search}%`,
  ];

  if (productIds.length > 0) {
    filters.push(`id.in.(${productIds.join(",")})`);
  }

  return filters.join(",");
}

async function getProductIdsBySku(search: string) {
  if (!search) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("product_variants")
    .select("product_id")
    .ilike("sku", `%${search}%`)
    .limit(100)
    .returns<Array<{ product_id: string }>>();

  return Array.from(new Set((data ?? []).map((row) => row.product_id)));
}

async function getProductIdsByPriceRange(minPrice: number, maxPrice: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_variants")
    .select("product_id, price, is_active")
    .gte("price", minPrice)
    .lte("price", maxPrice)
    .returns<Array<{ product_id: string; price: number; is_active: boolean | null }>>();

  const productIds = new Set<string>();

  for (const row of data ?? []) {
    if (row.is_active !== false) {
      productIds.add(row.product_id);
    }
  }

  return Array.from(productIds);
}

async function enrichProductCards(
  products: ProductRecord[],
): Promise<StorefrontProductCard[]> {
  if (products.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const productIds = products.map((product) => product.id);
  const categoryIds = products
    .map((product) => product.primary_category_id)
    .filter((id): id is string => Boolean(id));

  const [variantsResult, imagesResult, categoriesResult] = await Promise.all([
    supabase
      .from("product_variants")
      .select("id, product_id, sku, price, unit, is_active")
      .in("product_id", productIds)
      .returns<VariantRecord[]>(),
    supabase
      .from("product_images")
      .select("id, product_id, storage_path, alt_text, sort_order, is_primary")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true })
      .returns<ImageRecord[]>(),
    categoryIds.length
      ? supabase
          .from("categories")
          .select("id, name, slug")
          .in("id", categoryIds)
          .returns<CategoryRecord[]>()
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (variantsResult.error || imagesResult.error || categoriesResult.error) {
    return [];
  }

  const categoryById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category]),
  );
  const variantsByProductId = new Map<string, VariantRecord[]>();
  const imagesByProductId = new Map<string, ImageRecord[]>();

  for (const variant of variantsResult.data ?? []) {
    const existing = variantsByProductId.get(variant.product_id) ?? [];
    existing.push(variant);
    variantsByProductId.set(variant.product_id, existing);
  }

  for (const image of imagesResult.data ?? []) {
    if (!image.storage_path) {
      continue;
    }

    const existing = imagesByProductId.get(image.product_id) ?? [];
    existing.push(image);
    imagesByProductId.set(image.product_id, existing);
  }

  const activeVariantIds = (variantsResult.data ?? [])
    .filter((variant) => variant.is_active !== false)
    .map((variant) => variant.id);
  const stockByVariantId = await getAvailableStockByVariantIds(activeVariantIds);

  return products
    .filter((product) => product.slug)
    .map((product) => {
      const variants = (variantsByProductId.get(product.id) ?? []).filter(
        (variant) => variant.is_active !== false,
      );
      const prices = variants.map((variant) => variant.price);
      const minPrice = prices.length ? Math.min(...prices) : null;
      const maxPrice = prices.length ? Math.max(...prices) : null;
      const category = product.primary_category_id
        ? categoryById.get(product.primary_category_id)
        : null;
      const images = imagesByProductId.get(product.id) ?? [];
      const primaryImage =
        images.find((image) => image.is_primary) ?? images[0] ?? null;
      const inStock = variants.some(
        (variant) => (stockByVariantId.get(variant.id) ?? 0) > 0,
      );

      return {
        id: product.id,
        name: product.name,
        slug: product.slug as string,
        brand: product.brand,
        categoryId: product.primary_category_id,
        categoryName: category?.name ?? "General",
        categorySlug: category?.slug ?? null,
        minPrice,
        maxPrice,
        imageUrl: primaryImage
          ? getProductImagePublicUrl(primaryImage.storage_path)
          : null,
        imageAlt: primaryImage?.alt_text ?? product.name,
        inStock,
      };
    });
}

export async function getStorefrontCatalog({
  categorySlug,
  maxPrice,
  minPrice,
  page,
  search,
}: {
  categorySlug: string;
  maxPrice: number | null;
  minPrice: number | null;
  page: number;
  search: string;
}): Promise<StorefrontCatalogResult> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const from = (safePage - 1) * STOREFRONT_PRODUCTS_PAGE_SIZE;
  const to = from + STOREFRONT_PRODUCTS_PAGE_SIZE - 1;
  const normalizedSearch = normalizeSearch(search);

  let categoryId: string | null = null;

  if (categorySlug) {
    const { category, error } = await getCategoryBySlug(categorySlug);

    if (error) {
      return {
        products: [],
        totalCount: 0,
        page: safePage,
        pageSize: STOREFRONT_PRODUCTS_PAGE_SIZE,
        error,
      };
    }

    if (!category) {
      return {
        products: [],
        totalCount: 0,
        page: safePage,
        pageSize: STOREFRONT_PRODUCTS_PAGE_SIZE,
        error: null,
      };
    }

    categoryId = category.id;
  }

  const skuProductIds = await getProductIdsBySku(normalizedSearch);
  let priceFilteredProductIds: string[] | null = null;

  if (minPrice !== null && maxPrice !== null) {
    priceFilteredProductIds = await getProductIdsByPriceRange(minPrice, maxPrice);

    if (priceFilteredProductIds.length === 0) {
      return {
        products: [],
        totalCount: 0,
        page: safePage,
        pageSize: STOREFRONT_PRODUCTS_PAGE_SIZE,
        error: null,
      };
    }
  }

  let query = supabase
    .from("products")
    .select(
      "id, primary_category_id, name, slug, description, brand, status, created_at",
      { count: "exact" },
    )
    .eq("status", "active")
    .is("deleted_at", null)
    .not("slug", "is", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (categoryId) {
    query = query.eq("primary_category_id", categoryId);
  }

  if (normalizedSearch) {
    query = query.or(buildProductSearchFilter(normalizedSearch, skuProductIds));
  }

  if (priceFilteredProductIds) {
    query = query.in("id", priceFilteredProductIds);
  }

  const { data, count, error } = await query.returns<ProductRecord[]>();

  if (error) {
    return {
      products: [],
      totalCount: 0,
      page: safePage,
      pageSize: STOREFRONT_PRODUCTS_PAGE_SIZE,
      error: error.message,
    };
  }

  const products = await enrichProductCards(data ?? []);

  return {
    products,
    totalCount: count ?? 0,
    page: safePage,
    pageSize: STOREFRONT_PRODUCTS_PAGE_SIZE,
    error: null,
  };
}

export async function getFeaturedProducts(): Promise<{
  products: StorefrontProductCard[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, primary_category_id, name, slug, description, brand, status, created_at",
    )
    .eq("status", "active")
    .is("deleted_at", null)
    .not("slug", "is", null)
    .order("created_at", { ascending: false })
    .limit(STOREFRONT_FEATURED_PRODUCTS_LIMIT)
    .returns<ProductRecord[]>();

  if (error) {
    return { products: [], error: error.message };
  }

  return {
    products: await enrichProductCards(data ?? []),
    error: null,
  };
}

export async function getStorefrontProductBySlug(slug: string): Promise<{
  product: StorefrontProductDetail | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, primary_category_id, name, slug, description, brand, status, created_at",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle()
    .returns<ProductRecord | null>();

  if (error) {
    return { product: null, error: error.message };
  }

  if (!product || !product.slug) {
    return { product: null, error: null };
  }

  const [variantsResult, imagesResult, categoryResult] = await Promise.all([
    supabase
      .from("product_variants")
      .select("id, product_id, sku, price, unit, is_active")
      .eq("product_id", product.id)
      .order("price", { ascending: true })
      .returns<VariantRecord[]>(),
    supabase
      .from("product_images")
      .select("id, product_id, storage_path, alt_text, sort_order, is_primary")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true })
      .returns<ImageRecord[]>(),
    product.primary_category_id
      ? supabase
          .from("categories")
          .select("id, name, slug")
          .eq("id", product.primary_category_id)
          .maybeSingle()
          .returns<CategoryRecord | null>()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (variantsResult.error || imagesResult.error || categoryResult.error) {
    return {
      product: null,
      error:
        variantsResult.error?.message ??
        imagesResult.error?.message ??
        categoryResult.error?.message ??
        null,
    };
  }

  const activeVariants = (variantsResult.data ?? []).filter(
    (variant) => variant.is_active !== false,
  );
  const stockByVariantId = await getAvailableStockByVariantIds(
    activeVariants.map((variant) => variant.id),
  );
  const prices = activeVariants.map((variant) => variant.price);
  const variants = activeVariants.map((variant) => {
    const availableStock = stockByVariantId.get(variant.id) ?? 0;

    return {
      id: variant.id,
      sku: variant.sku,
      price: variant.price,
      unit: variant.unit,
      isActive: variant.is_active !== false,
      availableStock,
      inStock: availableStock > 0,
    };
  });

  const images = (imagesResult.data ?? [])
    .filter((image) => Boolean(image.storage_path))
    .map((image) => ({
      id: image.id,
      publicUrl: getProductImagePublicUrl(image.storage_path),
      altText: image.alt_text,
      isPrimary: image.is_primary,
    }));

  const inStock = variants.some((variant) => variant.inStock);

  return {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      categoryId: product.primary_category_id,
      categoryName: categoryResult.data?.name ?? "General",
      categorySlug: categoryResult.data?.slug ?? null,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
      images,
      variants,
      inStock,
    },
    error: null,
  };
}

export async function getRelatedProducts({
  categoryId,
  excludeProductId,
}: {
  categoryId: string | null;
  excludeProductId: string;
}): Promise<{ products: StorefrontProductCard[]; error: string | null }> {
  if (!categoryId) {
    return { products: [], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, primary_category_id, name, slug, description, brand, status, created_at",
    )
    .eq("status", "active")
    .eq("primary_category_id", categoryId)
    .neq("id", excludeProductId)
    .is("deleted_at", null)
    .not("slug", "is", null)
    .order("created_at", { ascending: false })
    .limit(STOREFRONT_RELATED_PRODUCTS_LIMIT)
    .returns<ProductRecord[]>();

  if (error) {
    return { products: [], error: error.message };
  }

  return {
    products: await enrichProductCards(data ?? []),
    error: null,
  };
}
