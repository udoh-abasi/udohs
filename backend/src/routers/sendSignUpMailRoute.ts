import { Router } from "express";
import SendSignUpMail from "../controllers/sendSignUpMailController";
import { validateEmail } from "../middlewares/validation";

const router = Router();

router.post("/sendsignupmail", validateEmail, SendSignUpMail);

export default router;
