// src/modules/category/category.router.ts
import { Router } from "express";
import { orderController } from "./order.controller";



const router = Router();

// POST /categories → category create
router.post("/orders", orderController.createOrder);

// GET /categories  category fetch
router.get("/orders", orderController.fetchOrder);
router.get("/orders/:id",orderController.getOrderByIdController);


router.get("/seller/orders", orderController.getSellerOrdersController);
router.patch("/seller/orders/:id", orderController.updateOrderStatusController);


export const orderRouter = router;