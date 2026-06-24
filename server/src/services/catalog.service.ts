import { supabase } from "../lib/supabase";
import { cacheGet, cacheSet } from "../lib/redis";
import { AppError } from "../middleware/error-handler";

const CACHE_TTL_CATEGORIES = 300; // 5 min
const CACHE_TTL_PRODUCTS = 120; // 2 min
const CACHE_TTL_PRODUCT_DETAIL = 300; // 5 min
const PAGE_SIZE = 12;

export async function getCategories() {
  const cacheKey = "categories:all";
  const cached = await cacheGet<any[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, parent_id, sort_order, is_active")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new AppError(500, "DB_ERROR", error.message);

  const result = data ?? [];
  await cacheSet(cacheKey, result, CACHE_TTL_CATEGORIES);
  return result;
}

export async function getProducts(params: {
  page?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}) {
  const { page = 1, search, category, minPrice, maxPrice, brand } = params;
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const cacheKey = `products:${JSON.stringify(params)}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

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

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (cat) {
      query = query.eq("primary_category_id", cat.id);
    }
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (brand) {
    query = query.ilike("brand", `%${brand}%`);
  }

  const { data: products, count, error } = await query;
  if (error) throw new AppError(500, "DB_ERROR", error.message);

  const productIds = (products ?? []).map((p: any) => p.id);

  let variants: any[] = [];
  let categories: any[] = [];
  let inventory: any[] = [];

  if (productIds.length > 0) {
    const [varRes, catRes] = await Promise.all([
      supabase
        .from("product_variants")
        .select("id, product_id, sku, price, unit, is_active")
        .in("product_id", productIds)
        .eq("is_active", true),
      supabase
        .from("categories")
        .select("id, name, slug")
        .in(
          "id",
          (products ?? []).map((p: any) => p.primary_category_id).filter(Boolean),
        ),
    ]);

    variants = varRes.data ?? [];
    categories = catRes.data ?? [];

    const variantIds = variants.map((v: any) => v.id);
    if (variantIds.length > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("variant_id, quantity_on_hand, quantity_reserved")
        .in("variant_id", variantIds);
      inventory = inv ?? [];
    }
  }

  // Price filtering (post-query since price is on variants)
  let filteredProducts = products ?? [];
  if (minPrice !== undefined || maxPrice !== undefined) {
    const variantsByProduct = new Map<string, any[]>();
    for (const v of variants) {
      const arr = variantsByProduct.get(v.product_id) ?? [];
      arr.push(v);
      variantsByProduct.set(v.product_id, arr);
    }

    filteredProducts = filteredProducts.filter((p: any) => {
      const pvs = variantsByProduct.get(p.id) ?? [];
      if (pvs.length === 0) return false;
      const prices = pvs.map((v: any) => v.price);
      const min = Math.min(...prices);
      if (minPrice !== undefined && min < minPrice) return false;
      if (maxPrice !== undefined && min > maxPrice) return false;
      return true;
    });
  }

  const categoryMap = new Map(categories.map((c: any) => [c.id, c]));
  const stockMap = new Map<string, number>();
  for (const row of inventory) {
    const available = row.quantity_on_hand - row.quantity_reserved;
    stockMap.set(row.variant_id, (stockMap.get(row.variant_id) ?? 0) + Math.max(available, 0));
  }

  const enriched = filteredProducts.map((p: any) => {
    const pvs = variants.filter((v: any) => v.product_id === p.id && v.is_active);
    const prices = pvs.map((v: any) => v.price);
    const cat = categoryMap.get(p.primary_category_id);
    const defaultVariant = pvs[0] ?? null;
    const availableStock = defaultVariant ? (stockMap.get(defaultVariant.id) ?? 0) : 0;
    const inStock = pvs.some((v: any) => (stockMap.get(v.id) ?? 0) > 0);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      categoryId: p.primary_category_id,
      categoryName: cat?.name ?? "General",
      categorySlug: cat?.slug ?? null,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
      inStock,
      defaultVariantId: defaultVariant?.id ?? null,
      availableStock,
      imageUrl: null,
    };
  });

  const result = {
    products: enriched,
    totalCount: count ?? 0,
    page: safePage,
    pageSize: PAGE_SIZE,
  };

  await cacheSet(cacheKey, result, CACHE_TTL_PRODUCTS);
  return result;
}

export async function getProductBySlug(slug: string) {
  const cacheKey = `product:${slug}`;
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;

  const { data: product, error } = await supabase
    .from("products")
    .select("id, primary_category_id, name, slug, description, brand, status, created_at")
    .eq("slug", slug)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  if (!product) throw new AppError(404, "NOT_FOUND", "Product not found");

  const [varRes, catRes] = await Promise.all([
    supabase
      .from("product_variants")
      .select("id, sku, price, unit, is_active")
      .eq("product_id", product.id)
      .eq("is_active", true),
    product.primary_category_id
      ? supabase
          .from("categories")
          .select("id, name, slug")
          .eq("id", product.primary_category_id)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const variants = varRes.data ?? [];
  const variantIds = variants.map((v: any) => v.id);

  let stockMap = new Map<string, number>();
  if (variantIds.length > 0) {
    const { data: inv } = await supabase
      .from("inventory")
      .select("variant_id, quantity_on_hand, quantity_reserved")
      .in("variant_id", variantIds);

    for (const row of inv ?? []) {
      const available = row.quantity_on_hand - row.quantity_reserved;
      stockMap.set(row.variant_id, (stockMap.get(row.variant_id) ?? 0) + Math.max(available, 0));
    }
  }

  const enrichedVariants = variants.map((v: any) => ({
    id: v.id,
    sku: v.sku,
    price: v.price,
    unit: v.unit,
    inStock: (stockMap.get(v.id) ?? 0) > 0,
    availableStock: stockMap.get(v.id) ?? 0,
  }));

  const result = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    categoryId: product.primary_category_id,
    categoryName: catRes.data?.name ?? "General",
    categorySlug: catRes.data?.slug ?? null,
    variants: enrichedVariants,
    inStock: enrichedVariants.some((v: any) => v.inStock),
    images: [],
  };

  await cacheSet(cacheKey, result, CACHE_TTL_PRODUCT_DETAIL);
  return result;
}
