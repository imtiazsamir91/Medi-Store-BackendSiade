import { Order, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// Order creation input type
//type AddOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt" | "items">;

 type AddOrderInput = {
  userId: string;
  shippingAddress: string;
  items: {
    medicineId: string;
    quantity: number;
  }[];
};

const addOrder = async (data: AddOrderInput) => {
  const { userId, shippingAddress, items } = data;

  if (!items || items.length === 0) {
    throw new Error("Order items required");
  }

  // 1️⃣ Medicine fetch
  const medicines = await prisma.medicine.findMany({
    where: {
      id: { in: items.map(i => i.medicineId) },
    },
  });

  if (medicines.length !== items.length) {
    throw new Error("Invalid medicine");
  }

  // 2️⃣ Total calculate
  let total = 0;
  const orderItems = items.map(item => {
    const medicine = medicines.find(m => m.id === item.medicineId)!;
    total += medicine.price * item.quantity;

    return {
      medicineId: medicine.id,
      quantity: item.quantity,
      price: medicine.price,
    };
  });

  // 3️⃣ Order + OrderItem create
  const order = await prisma.order.create({
    data: {
      userId,
      shippingAddress,
      total,
      status: OrderStatus.PLACED,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: { medicine: true },
      },
    },
  });

  return order;
};

 const getOrders = async () => {
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


//=======seller order======//
type UpdateOrderStatusInput = {
  orderId: string;
  sellerId: string;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
};

const getSellerOrders = async (sellerId: string) => {
  return await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId },
        },
      },
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateOrderStatus = async ({ orderId, sellerId, status }: UpdateOrderStatusInput) => {
  // Check seller owns any medicine in this order
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: {
          medicine: { sellerId },
        },
      },
    },
  });

  if (!order) throw new Error("Order not found or unauthorized");

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return updatedOrder;
};
//review

 const reviewService = {
  createReview: async ({ userId, medicineId, rating, comment }: { userId: string, medicineId: string, rating: number, comment: string }) => {
    if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");

    const review = await prisma.review.create({
      data: {
        userId,
        medicineId,
        rating,
        comment,
      },
    });

    return review;
  },

  getReviewsByMedicine: async (medicineId: string) => {
    return prisma.review.findMany({
      where: { medicineId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  getReviewsByUser: async (userId: string) => {
    return prisma.review.findMany({
      where: { userId },
      include: { medicine: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
};


export const orderService = {
  addOrder,
  getOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
};
