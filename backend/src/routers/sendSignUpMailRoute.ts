import { Router } from "express";
import { SendSignUpMail } from "../controllers/sendSignUpMailController";

const router = Router();

router.post("/sendsignupmail", SendSignUpMail);

export default router;
