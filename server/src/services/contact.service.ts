import { supabase } from "../lib/supabase";
import { AppError } from "../middleware/error-handler";

export async function createInquiry(input: {
  type: string;
  name: string;
  email: string;
  phone?: string;
  orderReference?: string;
  message: string;
  imageUrl?: string;
}) {
  const { data, error } = await supabase
    .from("contact_inquiries")
    .insert({
      type: input.type,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      order_reference: input.orderReference ?? null,
      message: input.message,
      image_url: input.imageUrl ?? null,
      status: "open",
    })
    .select()
    .single();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function getInquiries(page: number = 1, status?: string) {
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("contact_inquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return { inquiries: data ?? [], totalCount: count ?? 0, page, pageSize };
}

export async function updateInquiryStatus(id: string, status: string) {
  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new AppError(500, "DB_ERROR", error.message);
}
