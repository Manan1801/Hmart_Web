import { supabase } from "../lib/supabase";
import { AppError } from "../middleware/error-handler";

export async function getAddresses(userId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data ?? [];
}

export async function createAddress(
  userId: string,
  input: {
    recipientName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault?: boolean;
  },
) {
  if (input.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId)
      .eq("type", "shipping");
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      type: "shipping",
      recipient_name: input.recipientName,
      phone: input.phone,
      line1: input.line1,
      line2: input.line2 ?? null,
      city: input.city,
      state: input.state,
      postal_code: input.postalCode,
      country: "India",
      is_default: input.isDefault ?? false,
    })
    .select()
    .single();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function checkout(userId: string, addressId: string) {
  const { data, error } = await supabase.rpc("create_order_from_cart", {
    p_address_id: addressId,
  });

  if (error) throw new AppError(400, "CHECKOUT_FAILED", error.message);
  return { orderId: data };
}

export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, subtotal, discount_total, tax_total, shipping_total, grand_total, placed_at, created_at")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data ?? [];
}

export async function getOrderById(userId: string, orderId: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("buyer_id", userId)
    .single();

  if (error || !order) throw new AppError(404, "NOT_FOUND", "Order not found");

  const [itemsRes, addressRes] = await Promise.all([
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId),
    supabase
      .from("order_addresses")
      .select("*")
      .eq("order_id", orderId)
      .eq("type", "shipping")
      .maybeSingle(),
  ]);

  return {
    ...order,
    items: itemsRes.data ?? [],
    shippingAddress: addressRes.data ?? null,
  };
}
