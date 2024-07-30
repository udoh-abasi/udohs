import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/getuser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user) {
        return res
          .status(200)
          .json({ email: req.user?.email, id: req.user?._id });
      } else {
        throw new Error("Something went wrong");
      }
    } catch (e) {
      console.log("Error in getting user", e);
      return res.sendStatus(400);
    }
  }
);

export default router;
