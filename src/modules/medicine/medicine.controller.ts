import { Request, Response } from "express";
import { medicineService } from "./medicine.service";





const addMedicine=async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newMedicine = await medicineService.addMedicine(data);
    res.status(201).json(newMedicine);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};




const getAllMedicinesController = async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.query;
    const medicines = await medicineService.getAllMedicines({
      name: name as string,
      categoryId: categoryId as string,
    });
    res.status(200).json({ ok: true, data: medicines });
  } catch (error) {
    console.error("GetAllMedicines Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch medicines" });
  }
};

const getMedicineByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ ok: false, message: "Medicine ID is required" });
    }

    const medicine = await medicineService.getMedicineById(id);

    if (!medicine) {
      return res.status(404).json({ ok: false, message: "Medicine not found" });
    }

    res.status(200).json({ ok: true, data: medicine });
  } catch (error) {
    console.error("GetMedicineById Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch medicine" });
  }
};

const getAllCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await medicineService.getAllCategories();
    res.status(200).json({ ok: true, data: categories });
  } catch (error) {
    console.error("GetAllCategories Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch categories" });
  }
};

export const medicineController = {
  getAllMedicinesController,
  getMedicineByIdController,
  getAllCategoriesController,
    addMedicine,
};