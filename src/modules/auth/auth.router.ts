import { Router } from "express";
import { getMeController, loginController, registerController } from "./auth.controller";


const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", getMeController);

export const authRouter = router;
