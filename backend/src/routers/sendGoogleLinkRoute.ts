import { Router } from "express";
import sendGoogleLink from "../controllers/sendGoogleLinkController";

const router = Router();

router.get("/getgooglelink", sendGoogleLink);

export default router;
