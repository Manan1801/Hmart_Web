import { supabase } from "../lib/supabase";
import { cacheDel } from "../lib/redis";
import { AppError } from "../middleware/error-handler";

export async function getDashboard() {
  const [ordersRes, productsRes, customersRes, categoriesRes] = await Promise.all([
    supabase.from("orders").select("id, status, grand_total, created_at"),
    supabase.from("products").select("id").is("deleted_at", null),
    supabase.from("profiles").select("id").eq("status", "active"),
    supabase.from("categories").select("id").is("deleted_at", null),
  ]);

  const orders = ordersRes.data ?? [];
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.grand_total ?? 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === "pending_payment" || o.status === "confirmed").length;
  const completedOrders = orders.filter((o: any) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o: any) => o.status === "cancelled").length;

  return {
    totalOrders: orders.length,
    totalProducts: (productsRes.data ?? []).length,
    totalCustomers: (customersRes.data ?? []).length,
    totalCategories: (categoriesRes.data ?? []).length,
    totalRevenue,
    pendingOrders,
    completedOrders,
    cancelledOrders,
  };
}

export async function getAdminProducts(page: number = 1, search?: string) {
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("id, name, slug, brand, status, created_at, primary_category_id", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw new AppError(500, "DB_ERROR", error.message);

  return { products: data ?? [], totalCount: count ?? 0, page, pageSize };
}

export async function createProduct(input: {
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  primaryCategoryId?: string;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      brand: input.brand ?? null,
      primary_category_id: input.primaryCategoryId ?? null,
      status: "active",
    })
    .select()
    .single();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function updateProduct(id: string, input: Record<string, any>) {
  const updateData: any = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updateData.name = input.name;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.brand !== undefined) updateData.brand = input.brand;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.primaryCategoryId !== undefined) updateData.primary_category_id = input.primaryCategoryId;

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new AppError(500, "DB_ERROR", error.message);
}

export async function getAdminCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return data ?? [];
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
}) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      parent_id: input.parentId ?? null,
      sort_order: input.sortOrder ?? 0,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  await cacheDel("categories:all");
  return data;
}

export async function updateCategory(id: string, input: Record<string, any>) {
  const updateData: any = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updateData.name = input.name;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.isActive !== undefined) updateData.is_active = input.isActive;
  if (input.sortOrder !== undefined) updateData.sort_order = input.sortOrder;

  const { data, error } = await supabase.from("categories").update(updateData).eq("id", id).select().single();
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  await cacheDel("categories:all");
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  await cacheDel("categories:all");
}

export async function getAdminOrders(page: number = 1, status?: string) {
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("orders")
    .select("id, order_number, buyer_id, status, grand_total, placed_at, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return { orders: data ?? [], totalCount: count ?? 0, page, pageSize };
}

export async function updateOrderStatus(orderId: string, status: string, changedBy: string) {
  const { data: order } = await supabase.from("orders").select("status").eq("id", orderId).single();
  if (!order) throw new AppError(404, "NOT_FOUND", "Order not found");

  const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  if (error) throw new AppError(500, "DB_ERROR", error.message);

  await supabase.from("order_status_events").insert({
    order_id: orderId,
    from_status: order.status,
    to_status: status,
    changed_by: changedBy,
  });

  return { orderId, status };
}

export async function getUsers(page: number = 1) {
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, status, created_at", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new AppError(500, "DB_ERROR", error.message);
  return { users: data ?? [], totalCount: count ?? 0, page, pageSize };
}
