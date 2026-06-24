import { Response, NextFunction } from "express";
import { z } from "zod";
import * as adminService from "../services/admin.service";
import { AppError } from "../middleware/error-handler";
import type { AuthenticatedRequest } from "../types";

export async function getDashboard(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboard();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const search = req.query.q as string | undefined;
    const result = await adminService.getAdminProducts(page, search);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  primaryCategoryId: z.string().optional(),
});

export async function createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const body = createProductSchema.parse(req.body);
    const product = await adminService.createProduct(body);
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const product = await adminService.updateProduct(id, req.body);
    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await adminService.deleteProduct(id);
    res.json({ success: true, data: { message: "Product deleted" } });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const categories = await adminService.getAdminCategories();
    res.json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
}

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().optional(),
});

export async function createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const body = createCategorySchema.parse(req.body);
    const category = await adminService.createCategory(body);
    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const category = await adminService.updateCategory(id, req.body);
    res.json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    await adminService.deleteCategory(id);
    res.json({ success: true, data: { message: "Category deleted" } });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const status = req.query.status as string | undefined;
    const result = await adminService.getAdminOrders(page, status);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

const updateOrderStatusSchema = z.object({
  status: z.string().min(1),
});

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const orderId = req.params.id as string;
    const { status } = updateOrderStatusSchema.parse(req.body);
    const result = await adminService.updateOrderStatus(orderId, status, req.user.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const result = await adminService.getUsers(page);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
