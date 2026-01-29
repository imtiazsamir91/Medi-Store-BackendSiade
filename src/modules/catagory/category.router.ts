// src/modules/category/category.router.ts
import { Router } from "express";
import * as categoryController from "./category.controller";

const router = Router();

// POST /categories → category create
router.post("/", categoryController.createCategory);

// GET /categories  category fetch
router.get("/", categoryController.fetchCategories);

export const categoryRouter = router;
