import { Request, Response, NextFunction } from "express";
import * as catalogService from "../services/catalog.service";

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await catalogService.getCategories();
    res.json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, q, category, minPrice, maxPrice, brand } = req.query;
    const result = await catalogService.getProducts({
      page: page ? Number(page) : 1,
      search: q as string | undefined,
      category: category as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brand: brand as string | undefined,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await catalogService.getProductBySlug(req.params.slug as string);
    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
}
