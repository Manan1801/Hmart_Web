import { createClient } from "@/src/lib/supabase/server";
import { getAvailableStockByVariantIds } from "@/src/lib/storefront/inventory";
import {
  CART_MAX_QUANTITY,
  type CartDisplayItem,
  type CartStorageItem,
  type StorefrontCart,
} from "@/src/lib/storefront/cart-types";
import { getProductImagePublicUrl } from "@/src/lib/supabase/storage";

type CartRow = {
  id: string;
  user_id: string;
  status: string;
};

type CartItemRow = {
  variant_id: string;
  quantity: number;
};

type VariantRecord = {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  unit: string | null;
  is_active: boolean | null;
};

type ProductRecord = {
  id: string;
  primary_category_id: string | null;
  name: string;
  slug: string | null;
  brand: string | null;
  status: string;
  deleted_at: string | null;
};

type CategoryRecord = {
  id: string;
  name: string;
};

type ImageRecord = {
  id: string;
  product_id: string;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

function emptyCart(): StorefrontCart {
  return {
    items: [],
    summary: {
      itemCount: 0,
      totalQuantity: 0,
      subtotal: 0,
    },
  };
}

function normalizeCartItems(items: CartStorageItem[]) {
  const quantityByVariantId = new Map<string, number>();

  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));

    if (!item.variantId || !Number.isFinite(quantity) || quantity < 1) {
      continue;
    }

    const current = quantityByVariantId.get(item.variantId) ?? 0;
    quantityByVariantId.set(
      item.variantId,
      Math.min(current + quantity, CART_MAX_QUANTITY),
    );
  }

  return Array.from(quantityByVariantId, ([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
}

function buildCart(items: CartDisplayItem[]): StorefrontCart {
  const subtotal = items.reduce((sum, item) => sum + item.lineSubtotal, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    summary: {
      itemCount: items.length,
      totalQuantity,
      subtotal,
    },
  };
}

export async function hydrateCartItems(
  cartItems: CartStorageItem[],
): Promise<StorefrontCart> {
  const normalizedItems = normalizeCartItems(cartItems);

  if (normalizedItems.length === 0) {
    return emptyCart();
  }

  const supabase = await createClient();
  const variantIds = normalizedItems.map((item) => item.variantId);

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, product_id, sku, price, unit, is_active")
    .in("id", variantIds)
    .returns<VariantRecord[]>();

  if (variantsError || !variants?.length) {
    return emptyCart();
  }

  const productIds = Array.from(new Set(variants.map((variant) => variant.product_id)));

  const [productsResult, imagesResult, stockByVariantId] = await Promise.all([
    supabase
      .from("products")
      .select("id, primary_category_id, name, slug, brand, status, deleted_at")
      .in("id", productIds)
      .returns<ProductRecord[]>(),
    supabase
      .from("product_images")
      .select("id, product_id, storage_path, alt_text, sort_order, is_primary")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true })
      .returns<ImageRecord[]>(),
    getAvailableStockByVariantIds(variantIds),
  ]);

  if (productsResult.error || imagesResult.error) {
    return emptyCart();
  }

  const products = productsResult.data ?? [];
  const categoryIds = products
    .map((product) => product.primary_category_id)
    .filter((id): id is string => Boolean(id));

  const categoriesResult = categoryIds.length
    ? await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds)
        .returns<CategoryRecord[]>()
    : { data: [], error: null };

  if (categoriesResult.error) {
    return emptyCart();
  }

  const quantityByVariantId = new Map(
    normalizedItems.map((item) => [item.variantId, item.quantity]),
  );
  const productById = new Map(products.map((product) => [product.id, product]));
  const categoryById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category.name]),
  );
  const imagesByProductId = new Map<string, ImageRecord[]>();

  for (const image of imagesResult.data ?? []) {
    if (!image.storage_path) {
      continue;
    }

    const existing = imagesByProductId.get(image.product_id) ?? [];
    existing.push(image);
    imagesByProductId.set(image.product_id, existing);
  }

  const items = variants.flatMap((variant) => {
    const product = productById.get(variant.product_id);

    if (
      !product ||
      !product.slug ||
      product.status !== "active" ||
      product.deleted_at ||
      variant.is_active === false
    ) {
      return [];
    }

    const requestedQuantity = quantityByVariantId.get(variant.id) ?? 0;
    const availableStock = stockByVariantId.get(variant.id) ?? 0;
    const quantity = Math.min(requestedQuantity, Math.max(availableStock, 0));

    if (quantity < 1) {
      return [];
    }

    const images = imagesByProductId.get(product.id) ?? [];
    const primaryImage =
      images.find((image) => image.is_primary) ?? images[0] ?? null;

    return [
      {
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        brand: product.brand,
        categoryName: product.primary_category_id
          ? (categoryById.get(product.primary_category_id) ?? "General")
          : "General",
        sku: variant.sku,
        unit: variant.unit,
        price: variant.price,
        quantity,
        availableStock,
        imageUrl: primaryImage?.storage_path
          ? getProductImagePublicUrl(primaryImage.storage_path)
          : null,
        imageAlt: primaryImage?.alt_text ?? product.name,
        lineSubtotal: quantity * variant.price,
        isAvailable: availableStock > 0,
      },
    ];
  });

  return buildCart(items);
}

export async function getPersistentCart(userId: string): Promise<StorefrontCart> {
  const supabase = await createClient();
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id, user_id, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle()
    .returns<CartRow | null>();

  if (cartError || !cart) {
    return emptyCart();
  }

  const { data: items, error: itemsError } = await supabase
    .from("cart_items")
    .select("variant_id, quantity")
    .eq("cart_id", cart.id)
    .returns<CartItemRow[]>();

  if (itemsError) {
    return emptyCart();
  }

  return hydrateCartItems(
    (items ?? []).map((item) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    })),
  );
}
