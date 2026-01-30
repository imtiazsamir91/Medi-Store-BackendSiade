import { Request, Response } from "express";
import { orderService } from "./order.service";
import { medicineService } from "../medicine/medicine.service";


 const createOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newOrder = await orderService.addOrder(data);
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

 const fetchOrder = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ ok: false, message: "Order ID is required" });
    }

    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ ok: false, message: "Order not found" });
    }

    res.status(200).json({ ok: true, data: order });
  } catch (error) {
    console.error("GetOrderById Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch order" });
  }
};



export const orderController = {
    createOrder,
    fetchOrder,
    getOrderByIdController
}
