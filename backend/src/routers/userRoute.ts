import { Router } from "express";
import passport from "passport";

const router = Router();

// Return the currently logged in user
router.get(
  "/getuser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user) {
        return res.status(200).json({
          id: req.user?._id,
          email: req.user?.email,
          phoneNumber: req.user?.phoneNumber,
          fullName: req.user?.fullName,
          dateJoined: req.user?.dateJoined,
          profilePicture: req.user?.profilePicture,
        });
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
