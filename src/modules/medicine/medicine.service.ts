import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const addMedicines=async(data:Omit <Medicine ,"id"|"createdAt"|"updatedAt">)=>{
    // Logic to add medicines to the database
    const result = await prisma.medicine.create({
        data: data
    });
    return result;
}
export const medicineService={
    addMedicines
}