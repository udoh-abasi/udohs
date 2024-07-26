import { Router } from "express";
import SignUp from "../controllers/signUpController";
import { validateEmail, validatePassword } from "../middlewares/validation";

const router = Router();

router.post("/signup", validateEmail, validatePassword, SignUp);

export default router;
