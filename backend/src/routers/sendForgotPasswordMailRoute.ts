import { Router } from "express";
import { validateEmail } from "../middlewares/validation";
import SendForgotPasswordMail from "../controllers/sendForgotPasswordMailController";

const router = Router();

router.post("/sendforgotpasswordmail", validateEmail, SendForgotPasswordMail);

export default router;
