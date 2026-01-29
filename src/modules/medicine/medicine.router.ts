import { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = Router();

// Changed from POST /medicines to GET /categories
router.get("/categories", medicineController.getAllCategoriesController);

// Medicine routes
router.post("/medicines", medicineController.addMedicine);
router.get("/medicines", medicineController.getAllMedicinesController);
router.get("/medicines/:id", medicineController.getMedicineByIdController);

export const medicineRouter = router;