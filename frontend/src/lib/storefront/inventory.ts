import { createClient } from "@/src/lib/supabase/server";

export async function getAvailableStockByVariantIds(variantIds: string[]) {
  if (variantIds.length === 0) {
    return new Map<string, number>();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("variant_id, quantity_on_hand, quantity_reserved")
    .in("variant_id", variantIds)
    .returns<
      Array<{
        variant_id: string;
        quantity_on_hand: number;
        quantity_reserved: number;
      }>
    >();

  if (error) {
    return new Map<string, number>();
  }

  const stockByVariantId = new Map<string, number>();

  for (const row of data ?? []) {
    const available = row.quantity_on_hand - row.quantity_reserved;
    const current = stockByVariantId.get(row.variant_id) ?? 0;

    stockByVariantId.set(row.variant_id, current + Math.max(available, 0));
  }

  return stockByVariantId;
}

export async function getProductStockSummary(productId: string, variantIds: string[]) {
  const stockByVariantId = await getAvailableStockByVariantIds(variantIds);
  const totalAvailable = Array.from(stockByVariantId.values()).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  return {
    productId,
    totalAvailable,
    inStock: totalAvailable > 0,
    stockByVariantId,
  };
}
