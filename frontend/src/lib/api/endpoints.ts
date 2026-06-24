import { api } from "./client";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: { email: string; password: string; fullName: string; phone?: string }) =>
    api.post("/auth/register", body).then((r) => r.data),

  login: (body: { email: string; password: string }) =>
    api.post("/auth/login", body).then((r) => r.data),

  refresh: () => api.post("/auth/refresh").then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),
};

// ─── Catalog ────────────────────────────────────────────────────────────────

export const catalogApi = {
  getCategories: () => api.get("/categories").then((r) => r.data),

  getProducts: (params?: {
    page?: number;
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) => api.get("/products", { params }).then((r) => r.data),

  getProductBySlug: (slug: string) =>
    api.get(`/products/${slug}`).then((r) => r.data),
};

// ─── Cart ───────────────────────────────────────────────────────────────────

export const cartApi = {
  get: () => api.get("/cart").then((r) => r.data),

  addItem: (variantId: string, quantity: number) =>
    api.post("/cart/items", { variantId, quantity }).then((r) => r.data),

  updateItem: (variantId: string, quantity: number) =>
    api.patch(`/cart/items/${variantId}`, { quantity }).then((r) => r.data),

  removeItem: (variantId: string) =>
    api.delete(`/cart/items/${variantId}`).then((r) => r.data),
};

// ─── Orders ─────────────────────────────────────────────────────────────────

export const orderApi = {
  getAddresses: () => api.get("/addresses").then((r) => r.data),

  createAddress: (body: {
    recipientName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault?: boolean;
  }) => api.post("/addresses", body).then((r) => r.data),

  checkout: (addressId: string) =>
    api.post("/checkout", { addressId }).then((r) => r.data),

  getOrders: () => api.get("/orders").then((r) => r.data),

  getOrderById: (id: string) => api.get(`/orders/${id}`).then((r) => r.data),
};

// ─── Admin ──────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),

  getProducts: (params?: { page?: number; q?: string }) =>
    api.get("/admin/products", { params }).then((r) => r.data),

  createProduct: (body: any) =>
    api.post("/admin/products", body).then((r) => r.data),

  updateProduct: (id: string, body: any) =>
    api.patch(`/admin/products/${id}`, body).then((r) => r.data),

  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then((r) => r.data),

  getCategories: () => api.get("/admin/categories").then((r) => r.data),

  createCategory: (body: any) =>
    api.post("/admin/categories", body).then((r) => r.data),

  updateCategory: (id: string, body: any) =>
    api.patch(`/admin/categories/${id}`, body).then((r) => r.data),

  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}`).then((r) => r.data),

  getOrders: (params?: { page?: number; status?: string }) =>
    api.get("/admin/orders", { params }).then((r) => r.data),

  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data),

  getUsers: (params?: { page?: number }) =>
    api.get("/admin/users", { params }).then((r) => r.data),
};

// ─── Delivery ───────────────────────────────────────────────────────────────

export const deliveryApi = {
  getDashboard: () => api.get("/delivery/dashboard").then((r) => r.data),

  getOrders: () => api.get("/delivery/orders").then((r) => r.data),

  updateStatus: (id: string, status: string, note?: string) =>
    api.patch(`/delivery/orders/${id}/status`, { status, note }).then((r) => r.data),
};
