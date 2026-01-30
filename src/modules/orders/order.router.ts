// src/modules/category/category.router.ts
import { Router } from "express";
import { orderController } from "./order.controller";



const router = Router();

// POST /categories → category create
router.post("/", orderController.createOrder);

// GET /categories  category fetch
router.get("/", orderController.fetchOrder);
router.get("/:id",orderController.getOrderByIdController);

export const orderRouter = router;