import { supabase } from "../lib/supabase";
import { AppError } from "../middleware/error-handler";

async function getOrCreateActiveCart(userId: string): Promise<string> {
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId, status: "active" })
    .select("id")
    .single();

  if (error || !created) throw new AppError(500, "DB_ERROR", "Failed to create cart");
  return created.id;
}

export async function getCart(userId: string) {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!cart) {
    return { items: [], summary: { itemCount: 0, totalQuantity: 0, subtotal: 0 } };
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("variant_id, quantity")
    .eq("cart_id", cart.id);

  if (!cartItems || cartItems.length === 0) {
    return { items: [], summary: { itemCount: 0, totalQuantity: 0, subtotal: 0 } };
  }

  const variantIds = cartItems.map((ci: any) => ci.variant_id);

  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, product_id, sku, price, unit")
    .in("id", variantIds);

  const productIds = [...new Set((variants ?? []).map((v: any) => v.product_id))];

  const [productsRes, inventoryRes] = await Promise.all([
    supabase.from("products").select("id, name, slug, brand").in("id", productIds),
    supabase
      .from("inventory")
      .select("variant_id, quantity_on_hand, quantity_reserved")
      .in("variant_id", variantIds),
  ]);

  const products = productsRes.data ?? [];
  const productMap = new Map(products.map((p: any) => [p.id, p]));
  const variantMap = new Map((variants ?? []).map((v: any) => [v.id, v]));

  const stockMap = new Map<string, number>();
  for (const row of inventoryRes.data ?? []) {
    const available = row.quantity_on_hand - row.quantity_reserved;
    stockMap.set(row.variant_id, (stockMap.get(row.variant_id) ?? 0) + Math.max(available, 0));
  }

  const items = cartItems.map((ci: any) => {
    const variant = variantMap.get(ci.variant_id);
    const product = variant ? productMap.get(variant.product_id) : null;
    const availableStock = stockMap.get(ci.variant_id) ?? 0;

    return {
      variantId: ci.variant_id,
      productId: variant?.product_id ?? null,
      productName: product?.name ?? "Unknown",
      productSlug: product?.slug ?? "",
      brand: product?.brand ?? null,
      sku: variant?.sku ?? "",
      unit: variant?.unit ?? null,
      price: variant?.price ?? 0,
      quantity: ci.quantity,
      availableStock,
      lineSubtotal: (variant?.price ?? 0) * ci.quantity,
      isAvailable: availableStock > 0,
    };
  });

  const summary = {
    itemCount: items.length,
    totalQuantity: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
    subtotal: items.reduce((sum: number, i: any) => sum + i.lineSubtotal, 0),
  };

  return { items, summary };
}

export async function addItem(userId: string, variantId: string, quantity: number) {
  const cartId = await getOrCreateActiveCart(userId);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cartId)
    .eq("variant_id", variantId)
    .maybeSingle();

  const newQty = (existing?.quantity ?? 0) + quantity;

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq("cart_id", cartId)
      .eq("variant_id", variantId);
    if (error) throw new AppError(500, "DB_ERROR", error.message);
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, variant_id: variantId, quantity });
    if (error) throw new AppError(500, "DB_ERROR", error.message);
  }

  return getCart(userId);
}

export async function updateItem(userId: string, variantId: string, quantity: number) {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!cart) throw new AppError(404, "CART_NOT_FOUND", "No active cart");

  if (quantity <= 0) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("variant_id", variantId);
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("cart_id", cart.id)
      .eq("variant_id", variantId);
    if (error) throw new AppError(500, "DB_ERROR", error.message);
  }

  return getCart(userId);
}

export async function removeItem(userId: string, variantId: string) {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!cart) throw new AppError(404, "CART_NOT_FOUND", "No active cart");

  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id)
    .eq("variant_id", variantId);

  return getCart(userId);
}
