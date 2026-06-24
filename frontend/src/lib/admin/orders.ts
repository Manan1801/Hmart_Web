import { ORDER_STATUS_OPTIONS, type OrderStatus } from "@/src/lib/orders/types";
import { createClient } from "@/src/lib/supabase/server";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  buyerId: string;
  status: string;
  grandTotal: number;
  createdAt: string;
};

type OrderRecord = {
  id: string;
  order_number: string;
  buyer_id: string;
  status: string;
  grand_total: number;
  created_at: string;
};

export async function getAdminOrders(): Promise<{
  orders: AdminOrderListItem[];
  error: string | null;
}> {
  return getAdminOrdersFiltered({ search: "", status: "" });
}

export async function getAdminOrdersFiltered({
  search,
  status,
}: {
  search: string;
  status: string;
}): Promise<{
  orders: AdminOrderListItem[];
  error: string | null;
}> {
  const supabase = await createClient();
  const normalizedSearch = search.trim();
  let query = supabase
    .from("orders")
    .select("id, order_number, buyer_id, status, grand_total, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (normalizedSearch) {
    query = query.ilike("order_number", `%${normalizedSearch}%`);
  }

  if (ORDER_STATUS_OPTIONS.includes(status as OrderStatus)) {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query.returns<OrderRecord[]>();

  if (error) {
    return { orders: [], error: error.message };
  }

  return {
    orders: (orders ?? []).map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      buyerId: order.buyer_id,
      status: order.status,
      grandTotal: order.grand_total,
      createdAt: order.created_at,
    })),
    error: null,
  };
}
