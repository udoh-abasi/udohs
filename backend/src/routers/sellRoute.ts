import { Router } from "express";
import passport from "passport";
import Sell from "../controllers/sellController";
import multer from "multer";

const router = Router();

// Set up multer, to handle photos uploads
const photosUpload = multer({
  // Ensure only image files are stored
  fileFilter: (req, file, callback) => {
    try {
      // So, for image files, mimetype will start with 'image/'. E.g 'image/wep' or 'image/jpg' etc
      if (file.mimetype.startsWith("image/")) {
        return callback(null, true); // Setting true here means the file should be accepted. 'null' means no errors
      } else {
        return callback(null, false); // Setting false here means the file should NOT be accepted. 'null' means no errors
      }
    } catch {
      return callback(new Error("Something went wrong with the fileFilter"));
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // NOTE: This is 10MB. The default is infinity
  },
});

router.post(
  "/sell",
  passport.authenticate("jwt", { session: false }),
  photosUpload.array("photos"),
  Sell
);

export default router;
