import { Router } from "express";
import SignIn from "../controllers/signInController";
import passport from "passport";

const router = Router();

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  SignIn
);

export default router;
