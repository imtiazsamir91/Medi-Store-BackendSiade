import  express, { Router }  from "express";
import { medicineController } from "./medicine.controller";


const router=express.Router();


router.post('/',
    medicineController.addMedicines
);

export const medicineRouter:Router=router;