import { Router } from "express";
import { authController } from "./auth.controller";




const router = Router();

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.get("/me", authController.getMeController);

export const authRouter = router;
