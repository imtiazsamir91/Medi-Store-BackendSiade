import { Request, Response } from "express";
import { orderService } from "./order.service";
import { medicineService } from "../medicine/medicine.service";
import { auth } from "../../lib/auth";


 const createOrder = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
    }

    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const order = await orderService.addOrder({
      userId: session.user.id,
      shippingAddress: req.body.shippingAddress,
      items: req.body.items,
    });

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
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

    const order = await orderService.getOrderById(id as string);

    if (!order) {
      return res.status(404).json({ ok: false, message: "Order not found" });
    }

    res.status(200).json({ ok: true, data: order });
  } catch (error) {
    console.error("GetOrderById Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch order" });
  }
};


// GET /api/seller/orders
const getSellerOrdersController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
    }

    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sellerId = session.user.id;

    const orders = await orderService.getSellerOrders(sellerId);

    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/seller/orders/:id
const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
    }

    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sellerId = session.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

    const updatedOrder = await orderService.updateOrderStatus({
      orderId: id as string,
      sellerId,
      status,
    });

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//review controller



export const orderController = {
    createOrder,
    fetchOrder,
    getOrderByIdController,
    getSellerOrdersController,
    updateOrderStatusController,
}
