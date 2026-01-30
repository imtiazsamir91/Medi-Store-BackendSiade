import { Request, Response } from "express";
import { auth } from "../../lib/auth";
import { medicineService } from "./medicine.service";

// ---------------- ADD MEDICINE ----------------
const addMedicine = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([k, v]) => typeof v === "string" && headers.set(k, v));
    const session = await auth.api.getSession({ headers });

    if (!session?.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const sellerId = session.user.id;
    const data = { ...req.body, sellerId };

    const newMedicine = await medicineService.addMedicine(data);
    res.status(201).json({ success: true, medicine: newMedicine });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- GET ALL MEDICINES ----------------
const getAllMedicinesController = async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.query;
    const medicines = await medicineService.getAllMedicines({
      name: name as string,
      categoryId: categoryId as string,
    });
    res.status(200).json({ ok: true, data: medicines });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: "Failed to fetch medicines" });
  }
};

// ---------------- GET MEDICINES OF SELLER ----------------
const getSellerMedicinesController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([k, v]) => typeof v === "string" && headers.set(k, v));
    const session = await auth.api.getSession({ headers });

    if (!session?.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const sellerId = session.user.id;
    const medicines = await medicineService.getSellerMedicines(sellerId);

    res.status(200).json({ success: true, medicines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET MEDICINE BY ID ----------------
const getMedicineByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ ok: false, message: "Medicine ID is required" });

    const medicine = await medicineService.getMedicineById(id);
    if (!medicine) return res.status(404).json({ ok: false, message: "Medicine not found" });

    res.status(200).json({ ok: true, data: medicine });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// ---------------- GET ALL CATEGORIES ----------------
const getAllCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await medicineService.getAllCategories();
    res.status(200).json({ ok: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

// ---------------- UPDATE MEDICINE ----------------
const updateMedicineController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([k, v]) => typeof v === "string" && headers.set(k, v));
    const session = await auth.api.getSession({ headers });
    if (!session?.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    const medicine = await medicineService.updateMedicine({
      medicineId: id,
      sellerId: session.user.id,
      data: req.body,
    });

    res.status(200).json({ success: true, medicine });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE MEDICINE ----------------
const deleteMedicineController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([k, v]) => typeof v === "string" && headers.set(k, v));
    const session = await auth.api.getSession({ headers });
    if (!session?.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Invalid medicine id" });

    await medicineService.deleteMedicine({ medicineId: id, sellerId: session.user.id });
    res.status(200).json({ success: true, message: "Medicine deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const medicineController = {
  addMedicine,
  getAllMedicinesController,
  getSellerMedicinesController,
  getMedicineByIdController,
  getAllCategoriesController,
  updateMedicineController,
  deleteMedicineController,
};
