import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";



  const addMedicine = async (data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "reviews" | "orders">) => {
  try {
    const result = await prisma.medicine.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        sellerId: data.sellerId,
      },
    });
    return result;
  } catch (error) {
    console.error("Error in addMedicine:", error);
    throw error;
  }
};

const getAllMedicines = async (filters?: { name?: string; categoryId?: string }) => {
  const where: any = {};

  if (filters?.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }

  // Only add categoryId filter if it's a valid truthy string
  if (filters?.categoryId && filters.categoryId.trim() !== "") {
    where.categoryId = filters.categoryId;
  }

  return await prisma.medicine.findMany({
    where,
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getMedicineById = async (id: string) => {
  return await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true } },
      reviews: { 
        include: { 
          user: { select: { id: true, name: true } } 
        } 
      },
    },
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    // Removed include: { medicines: true } to prevent heavy payloads 
    // unless you specifically need all meds per category list
    orderBy: { name: "asc" },
  });
};

export const medicineService = {
   
  getAllMedicines,
  getMedicineById,
  getAllCategories,
   addMedicine,
};