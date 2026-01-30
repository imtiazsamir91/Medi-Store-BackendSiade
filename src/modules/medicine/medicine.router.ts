import { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = Router();

// Changed from POST /medicines to GET /categories
router.get("/categories", medicineController.getAllCategoriesController);

// Medicine routes
router.post("/seller/medicines", medicineController.addMedicine);
router.get('/medicines', medicineController.getAllMedicinesController); 

router.get("/medicines/:id", medicineController.getMedicineByIdController);
router.put("/seller/medicines/:id", medicineController.updateMedicineController);
router.delete("/seller/medicines/:id", medicineController.deleteMedicineController);

//review
router.post("/reviews", medicineController.createReviewController);
router.get("/medicine/:id", medicineController.getReviewsByMedicineController);
router.get("/user/:id", medicineController.getReviewsByUserController);



export const medicineRouter = router;