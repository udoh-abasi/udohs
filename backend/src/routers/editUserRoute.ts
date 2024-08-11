import { Router } from "express";
import passport from "passport";
import EditUser from "../controllers/editUserController";
import multer from "multer";

const router = Router();

// NOTE: I did not use this because I do not want the image to be saved (stored) by multer. I want that to be done by sharp instead

// const profilePicStorage = multer.diskStorage({
//   destination: "./src/images/profileImages/", // Here, we provide a location the file should be stored

//   filename: (req, file, callback) => {
//     if (file.mimetype.startsWith("image/")) {
//       const mimeType = file.mimetype; // The mimetype will be something like this - 'image/wep' or 'image/jpg', etc
//       const slashIndex = mimeType.indexOf("/"); // Since the mimetype will be in the format 'image/wep' or 'image/jpg', we get the index of the slash, and then slice from there
//       const imageExtension = mimeType.slice(slashIndex + 1);

//       console.log("Here", file);

//       return callback(null, file.originalname.replace(/:/g, "-")); // The frontend sends a filename (with the right file extension). So, we want to use it here. NOTE: Windows OS doesn't accept files with a ":", so we replace every ':' with a dash (-)
//     } else {
//       return callback(new Error("Error occurred in profile pic filename."), "");
//     }
//   },
// });

// Set up multer, to handle profile image uploads
const profilePicUpload = multer({
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
      return callback(
        new Error("Something went wrong with the fileFilter in profile pic")
      );
    }
  },

  // NOTE: I did not use either 'dest' or 'destination' because I do not want the image to be saved (stored) by multer. I want that to be done by sharp

  // dest: "profileImages/", // Where to store the file
  // storage: profilePicStorage, // Where to store the file

  limits: {
    fileSize: 10 * 1024 * 1024, // NOTE: This is 10MB. The default is infinity
  },
});

router.post(
  "/edituser",
  passport.authenticate("jwt", { session: false }),
  profilePicUpload.single("profilePic"),
  EditUser
);

export default router;
