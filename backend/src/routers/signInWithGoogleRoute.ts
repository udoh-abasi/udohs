import { Router } from "express";
import signInWithGoogle from "../controllers/signInWithGoogleController";
import passport from "passport";

const router = Router();

router.post(
  "/signinwithgoogle",
  passport.authenticate("google", { scope: ["profile"], session: false }),
  signInWithGoogle
);

export default router;
