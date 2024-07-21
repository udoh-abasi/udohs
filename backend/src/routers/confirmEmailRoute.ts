import { Router } from "express";
import ConfirmEmail from "../controllers/confirmEmailController";

const router = Router();

router.post("/confirmemail", ConfirmEmail);

export default router;
