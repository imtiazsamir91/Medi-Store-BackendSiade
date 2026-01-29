// src/modules/category/category.controller.ts
import { Request, Response } from "express";
import * as categoryService from "./category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newCategory = await categoryService.addCategory(data);
    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
