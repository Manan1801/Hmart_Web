import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.get("/dashboard", adminController.getDashboard);

router.get("/products", adminController.getProducts);
router.post("/products", adminController.createProduct);
router.patch("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.patch("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

router.get("/orders", adminController.getOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

router.get("/users", adminController.getUsers);

export default router;
