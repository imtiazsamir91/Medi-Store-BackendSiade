import { Order, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Order creation input type
type AddOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt" | "items">;

export const addOrder = async (data: AddOrderInput) => {
  try {
    const result = await prisma.order.create({
      data: {
        userId: data.userId,
        status: data.status || OrderStatus.PLACED, 
        total: data.total,
        shippingAddress: data.shippingAddress,
      
      },
    });
    return result;
  } catch (error) {
    console.error("Error in addOrder:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, user: true }, 
    });
    return orders;
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw error;
  }
};

const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
};


export const orderService = {
  addOrder,
  getOrders,
  getOrderById
};
