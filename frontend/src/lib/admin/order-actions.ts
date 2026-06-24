"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { ORDER_STATUS_OPTIONS, type OrderStatus } from "@/src/lib/orders/types";

export type AdminOrderActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialAdminOrderActionState: AdminOrderActionState = {
  status: "idle",
  message: "",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_OPTIONS.includes(value as OrderStatus);
}

export async function updateAdminOrderStatusAction(
  _previousState: AdminOrderActionState,
  formData: FormData,
): Promise<AdminOrderActionState> {
  const orderId = getStringValue(formData, "orderId");
  const status = getStringValue(formData, "status");

  if (!UUID_PATTERN.test(orderId)) {
    return { status: "error", message: "Invalid order id." };
  }

  if (!isOrderStatus(status)) {
    return { status: "error", message: "Select a valid order status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/orders");

  return { status: "success", message: "Order status updated." };
}
