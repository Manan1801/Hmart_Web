import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:variantId", cartController.updateItem);
router.delete("/items/:variantId", cartController.removeItem);

export default router;
