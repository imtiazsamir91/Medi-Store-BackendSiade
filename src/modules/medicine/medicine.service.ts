import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// ---------------- ADD MEDICINE ----------------
const addMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "reviews" | "orders"> & { sellerId: string }
) => {
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
};

// ---------------- GET ALL MEDICINES (WITH FILTERS) ----------------
const getAllMedicines = async (filters?: { name?: string; categoryId?: string }) => {
  const where: any = {};

  if (filters?.name) where.name = { contains: filters.name, mode: "insensitive" };
  if (filters?.categoryId && filters.categoryId.trim() !== "") where.categoryId = filters.categoryId;

  return await prisma.medicine.findMany({
    where,
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ---------------- GET MEDICINE BY ID ----------------
const getMedicineById = async (id: string) => {
  return await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true } },
      reviews: { include: { user: { select: { id: true, name: true } } } },
    },
  });
};

// ---------------- GET ALL CATEGORIES ----------------
const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

// ---------------- GET MEDICINES BY SELLER ----------------
const getSellerMedicines = async (sellerId: string) => {
  return await prisma.medicine.findMany({
    where: { sellerId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

// ---------------- UPDATE MEDICINE ----------------
const updateMedicine = async ({
  medicineId,
  sellerId,
  data,
}: {
  medicineId: string;
  sellerId: string;
  data: Partial<Omit<Medicine, "id" | "createdAt" | "updatedAt" | "reviews" | "orders" | "sellerId">>;
}) => {
  const medicine = await prisma.medicine.findFirst({ where: { id: medicineId, sellerId } });
  if (!medicine) throw new Error("Medicine not found or unauthorized");
  return await prisma.medicine.update({ where: { id: medicineId }, data });
};

// ---------------- DELETE MEDICINE ----------------
const deleteMedicine = async ({ medicineId, sellerId }: { medicineId: string; sellerId: string }) => {
  const medicine = await prisma.medicine.findFirst({ where: { id: medicineId, sellerId } });
  if (!medicine) throw new Error("Medicine not found or unauthorized");

  await prisma.medicine.delete({ where: { id: medicineId } });
  return { success: true };
};

export const medicineService = {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  getAllCategories,
  getSellerMedicines,
  updateMedicine,
  deleteMedicine,
};
