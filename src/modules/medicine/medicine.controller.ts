import { Request, Response } from "express";

import { auth } from "../../lib/auth";
import { medicineService } from "./medicine.service";



;






const addMedicine = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
    }

    const session = await auth.api.getSession({ headers });
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sellerId = session.user.id;

    const data = { ...req.body, sellerId }; // <-- add sellerId here

    const newMedicine = await medicineService.addMedicine(data);
    res.status(201).json({ success: true, medicine: newMedicine });
  } catch (error: any) {
    console.error("Error in addMedicine:", error);
    res.status(400).json({ success: false, message: error.message });
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

const updateMedicineController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([k,v]) => typeof v === "string" && headers.set(k,v));
    const session = await auth.api.getSession({ headers });
    if (!session?.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    const medicine = await medicineService.updateMedicine({medicineId:id , sellerId: session.user.id, data: req.body });
    res.status(200).json({ success: true, medicine });
    console.log("Updated medicine:", medicine);
   
    console.log("medicineService:", medicineService);
    console.log(session.user.id, id, req.body);
  } catch (err: any) { res.status(400).json({ success: false, message: err.message }); }
};

// DELETE /api/seller/medicines/:id
 const deleteMedicineController = async (req: Request, res: Response) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers.set(key, value);
    }

    const session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const sellerId = session.user.id;

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Invalid medicine id" });
    }

    await medicineService.deleteMedicine({ medicineId: id, sellerId });

    res.status(200).json({ success: true, message: "Medicine deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};




export const medicineController = {
  getAllMedicinesController,
  getMedicineByIdController,
  getAllCategoriesController,
    addMedicine,
  updateMedicineController ,
  deleteMedicineController,
};