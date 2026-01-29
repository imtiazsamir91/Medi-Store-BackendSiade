
import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { error } from "node:console";
const addMedicines=async(req:Request,res:Response)=>{
    try{
        const result=await  medicineService.addMedicines(req.body);
        res.status(201).json(result)
        
    }catch(e){
       
        res.status(500).json({
           error:"Internal Server Error",
           details:e
        });
    }
}

export  const medicineController={
    addMedicines
}