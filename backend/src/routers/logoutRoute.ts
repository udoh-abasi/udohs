import { Router } from "express";

const router = Router();

router.post("/logout", async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        throw new Error("Something went wrong");
      }

      // Remove the 'token' cookie from the frontend.
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        // sameSite: true,
      });

      return res.sendStatus(200);
    });
  } catch (e) {
    return res.sendStatus(404);
  }
});

export default router;
