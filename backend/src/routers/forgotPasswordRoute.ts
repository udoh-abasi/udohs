import { Router } from "express";
import { validateEmail, validatePassword } from "../middlewares/validation";
import ForgotPassword from "../controllers/forgotPasswordController";

const router = Router();

router.post("/changepassword", validateEmail, validatePassword, ForgotPassword);

export default router;
