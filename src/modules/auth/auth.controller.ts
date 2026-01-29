import { Request, Response } from "express";
import { authService } from "./auth.service";



 const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, image } = req.body;
    const result = await authService.registerUser({ name, email, password, role, image });

    if (result.error) {
      return res.status(422).json({ success: false, message: result.error, user: result.user });
    }

    res.status(201).json({ success: true, token: result.token, user: result.user });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    if (result.error) {
      return res.status(401).json({ success: false, message: result.error });
    }

    res.status(200).json({ success: true, token: result.token, user: result.user });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 const getMeController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    const result = await authService.getCurrentUser(token);

    if (result.error) return res.status(401).json({ success: false, message: result.error });

    res.status(200).json({ success: true, user: result.user });
  } catch (error: any) {
    console.error("GetMe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const authController = {
  registerController,
  loginController,
  getMeController
}