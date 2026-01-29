// src/modules/category/category.service.ts
import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"; // তোমার prisma instance path

export const addCategory = async (data: Omit<Category, "id">) => {
  try {
    const result = await prisma.category.create({
      data: {
        name: data.name,
      },
    });
    return result;
  } catch (error) {
    console.error("Error in addCategory:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error;
  }
};
