import { createClient } from "@/src/lib/supabase/server";
import type {
  BuyerOrderDetail,
  BuyerOrderItem,
  BuyerOrderListItem,
} from "./types";

type OrderRecord = {
  id: string;
  order_number: string;
  buyer_id: string;
  status: string;
  currency: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_total: number;
  grand_total: number;
  notes: string | null;
  created_at: string;
};

type OrderItemRecord = {
  id: string;
  variant_id: string;
  sku_snapshot: string;
  product_name_snapshot: string;
  variant_attributes_snapshot: Record<string, unknown> | null;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
};

function mapOrder(row: OrderRecord): BuyerOrderListItem {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    currency: row.currency,
    subtotal: row.subtotal,
    discountTotal: row.discount_total,
    taxTotal: row.tax_total,
    shippingTotal: row.shipping_total,
    grandTotal: row.grand_total,
    createdAt: row.created_at,
  };
}

function mapOrderItem(row: OrderItemRecord): BuyerOrderItem {
  return {
    id: row.id,
    variantId: row.variant_id,
    skuSnapshot: row.sku_snapshot,
    productNameSnapshot: row.product_name_snapshot,
    variantAttributesSnapshot: row.variant_attributes_snapshot,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    discountAmount: row.discount_amount,
    taxAmount: row.tax_amount,
    lineTotal: row.line_total,
  };
}

export async function getBuyerOrders(userId: string): Promise<{
  orders: BuyerOrderListItem[];
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, buyer_id, status, currency, subtotal, discount_total, tax_total, shipping_total, grand_total, notes, created_at",
    )
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false })
    .returns<OrderRecord[]>();

  if (error) {
    return { orders: [], error: error.message };
  }

  return { orders: (data ?? []).map(mapOrder), error: null };
}

export async function getBuyerOrderById(
  userId: string,
  orderId: string,
): Promise<{ order: BuyerOrderDetail | null; error: string | null }> {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, buyer_id, status, currency, subtotal, discount_total, tax_total, shipping_total, grand_total, notes, created_at",
    )
    .eq("id", orderId)
    .eq("buyer_id", userId)
    .maybeSingle()
    .returns<OrderRecord | null>();

  if (error) {
    return { order: null, error: error.message };
  }

  if (!order) {
    return { order: null, error: null };
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(
      "id, variant_id, sku_snapshot, product_name_snapshot, variant_attributes_snapshot, quantity, unit_price, discount_amount, tax_amount, line_total",
    )
    .eq("order_id", order.id)
    .returns<OrderItemRecord[]>();

  if (itemsError) {
    return { order: null, error: itemsError.message };
  }

  return {
    order: {
      ...mapOrder(order),
      buyerId: order.buyer_id,
      notes: order.notes,
      items: (items ?? []).map(mapOrderItem),
    },
    error: null,
  };
}
