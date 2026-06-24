import { supabase } from "../lib/supabase";
import { AppError } from "../middleware/error-handler";

export async function getDashboard(userId: string) {
  const { data: deliveries } = await supabase
    .from("deliveries")
    .select("id, status, delivered_at, created_at")
    .eq("partner_id", userId);

  const all = deliveries ?? [];
  const assigned = all.filter((d: any) => d.status === "assigned").length;
  const inTransit = all.filter((d: any) => d.status === "in_transit" || d.status === "picked_up").length;
  const delivered = all.filter((d: any) => d.status === "delivered").length;
  const total = all.length;

  return { totalAssigned: total, pending: assigned, inTransit, delivered };
}

export async function getAssignedOrders(userId: string) {
  const { data, error } = await supabase
    .from("deliveries")
    .select(`
      id, status, tracking_number, assigned_at, created_at,
      orders!inner(id, order_number, grand_total, placed_at)
    `)
    .eq("partner_id", userId)
    .in("status", ["assigned", "accepted", "picked_up", "in_transit"])
    .order("created_at", { ascending: false });

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data ?? [];
}

export async function updateDeliveryStatus(
  userId: string,
  deliveryId: string,
  status: string,
  note?: string,
) {
  const { data: delivery } = await supabase
    .from("deliveries")
    .select("id, partner_id, status")
    .eq("id", deliveryId)
    .eq("partner_id", userId)
    .single();

  if (!delivery) throw new AppError(404, "NOT_FOUND", "Delivery not found or not assigned to you");

  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (status === "accepted") updateData.accepted_at = new Date().toISOString();
  if (status === "picked_up") updateData.picked_up_at = new Date().toISOString();
  if (status === "delivered") updateData.delivered_at = new Date().toISOString();

  const { error } = await supabase.from("deliveries").update(updateData).eq("id", deliveryId);
  if (error) throw new AppError(500, "DB_ERROR", error.message);

  await supabase.from("delivery_status_events").insert({
    delivery_id: deliveryId,
    status,
    note: note ?? null,
    created_by: userId,
  });

  return { deliveryId, status };
}
