import { Router } from "express";
import passport from "passport";
import multer from "multer";
import AddProduct from "../controllers/AddNewProductController";
import GetOneProduct from "../controllers/GetOneProductController";
import GetAllProduct from "../controllers/GetAllProductController";

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

// This is the post route that adds a new product
router.post(
  "/product",
  passport.authenticate("jwt", { session: false }),
  photosUpload.array("photos"),
  AddProduct
);

// This route returns the individual product requested by the user
router.get("/product/:productID", GetOneProduct);

// This route returns ALL product requested by the user
router.get("/product", GetAllProduct);

export default router;
