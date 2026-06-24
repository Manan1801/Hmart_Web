import { Router } from "express";
import * as catalogController from "../controllers/catalog.controller";

const router = Router();

router.get("/categories", catalogController.getCategories);
router.get("/products", catalogController.getProducts);
router.get("/products/:slug", catalogController.getProductBySlug);

export default router;
