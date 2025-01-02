import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { imageDirectory } from "../index";
import { v2 as cloudinary } from "cloudinary";

// This function deletes the temporary image, after it has been sent to cloudinary
export const deleteTempImageFile = (thePicPath: string) => {
  fs.unlink(thePicPath, (err) => {
    if (err) {
      // Do nothing, because I don't want this to affect the outcome to the client
    }
  });
};

// IN PRODUCTION - This function uploads the image to cloudinary.
// 'filepath' is the full path to the image we want to upload.
// 'folderName' is the name of the folder in cloudinary that we want to upload the image to.
export const uploadToCloudinary = async (
  filePath: string,
  folderName: string
) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: folderName, // Optional: Organize files into a folder
    use_filename: true, // Use the uploaded image's original name as the image's public ID on cloudinary
    unique_filename: true,
    overwrite: true, // allow overwriting the image with new versions, if they're the same name
  });

  return result.secure_url; // URL of the uploaded image. This is usually in the format 'https://res.cloudinary.com/drqepxmnc/image/upload/v1735485662/profilePic/gw1s4jg7pu686olcgvgc.jpg'
};

const EditUser = async (req: Request, res: Response) => {
  try {
    let { phoneNumber, fullName } = req.body;

    phoneNumber = phoneNumber.trim();
    fullName = fullName.trim();

    // Get the profile image
    const profilePic = req.file;

    // Get the 'users' collection
    const usersCollection = udohsDatabase.collection<UserCollection>("users");

    // If the user wants to edit their profile pic
    if (profilePic && phoneNumber && fullName) {
      // NOTE: In production, when you host on 'vercel', we have a temporary folder called 'tmp', where we can store temporary files.
      // If you try creating any other folder, you will get errors
      const tempDir = "/tmp";

      // Ensure the directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true }); // Create the temporary directory
      }

      // After resizing the image with sharp, we will temporarily store it in this path
      const resizedImagePath = path.join(tempDir, `${profilePic.originalname}`);

      // FOR DEVELOPMENT - Get the directory where profile pic are stored. On development, if you console.log this 'profilePicDirectory', you will see 'C:\Users\dell\Desktop\udohs\backend/src/public/profileImages'
      const profilePicDirectory = path.join(imageDirectory, "profileImages/"); // NOTE: 'imageDirectory' is defined in 'index.ts' file, and it points to the folder where we have images. We just joined it with 'profileImages', to get the profile image folder

      // This holds the cropped image by sharp
      let theCroppedImage: sharp.OutputInfo;

      try {
        // Try to save the image into the profile pic directory
        theCroppedImage = await sharp(profilePic?.buffer)
          .resize(300, 300, {
            fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (300x300) if the image's width or height is larger than 300. If after shrinking, and let's say, the image is now 300x200, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 300x300
            position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
            background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
            withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 300px, if either the width or height is less than 300px
          })
          .toFile(resizedImagePath);

        // FOR DEVELOPMENT - Try to save the image into the profile pic directory
        // theCroppedImage = await sharp(profilePic?.buffer)
        //   .resize(300, 300, {
        //     fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (300x300) if the image's width or height is larger than 300. If after shrinking, and let's say, the image is now 300x200, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 300x300
        //     position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
        //     background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
        //     withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 300px, if either the width or height is less than 300px
        //   })
        //   .toFile(`${profilePicDirectory}/${profilePic?.originalname}`); // NOTE: We used the original name sent by the frontend here
      } catch (e) {
        // NOTE: An error will occur if the profile pic directory does not exist, as sharp does not create directories for us, if they DO NOT exist
        if (
          // This is done to prevent typescript errors
          typeof e === "object" &&
          e &&
          "message" in e &&
          typeof e.message === "string"
        ) {
          // Check if the error message contains the text 'unable to open for write', if true, that means the profile pic directory does not exist
          if (e.message.toLowerCase().includes("unable to open for write")) {
            try {
              // Check if the directory does NOT exist for real
              const folderAlreadyExist = fs.existsSync(profilePicDirectory);

              // If directory does not exist, then create it
              if (!folderAlreadyExist) {
                // fs.mkdirSync(profilePicDirectory, { recursive: true }); // NOTE: Setting 'recursive' to true is necessary, if not there will be errors, because, currently, we have the src folder, and we are trying to create two new folders (i.e, public and profileImages), so, we have to do that recursively
              }

              // Then we try to save the image into the profile pic directory again
              // theCroppedImage = await sharp(profilePic?.buffer)
              //   .resize(300, 300, {
              //     fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (300x300) if the image's width or height is larger than 300. If after shrinking, and let's say, the image is now 300x200, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 300x300
              //     position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
              //     background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
              //     withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 300px, if either the width or height is less than 300px
              //   })
              //   .toFile(`${profilePicDirectory}/${profilePic?.originalname}`); // NOTE: We used the original name sent by the frontend here

              // Try to save the image into the profile pic directory
              theCroppedImage = await sharp(profilePic?.buffer)
                .resize(300, 300, {
                  fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (300x300) if the image's width or height is larger than 300. If after shrinking, and let's say, the image is now 300x200, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 300x300
                  position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
                  background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
                  withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 300px, if either the width or height is less than 300px
                })
                .toFile(resizedImagePath); // NOTE: We used the original name sent by the frontend here
            } catch (e) {
              console.log(e);
              return res.sendStatus(400);
            }
          } else {
            return res.sendStatus(400);
          }
        } else {
          return res.sendStatus(400);
        }
      }

      if (theCroppedImage.width === 300 && theCroppedImage.height === 300) {
        // Upload the image to cloudinary. This returns the image link
        const theResult = await uploadToCloudinary(
          resizedImagePath,
          "profilePic"
        );

        // Delete the temporary picture
        deleteTempImageFile(resizedImagePath);

        // Get the logged in user, and change their name and phone number and profile pic. This ensures another user does not change another user's details
        const user = await usersCollection.findOneAndUpdate(
          { email: req.user?.email },
          {
            $set: {
              fullName,
              phoneNumber,
              // profilePicture: `${profilePic?.originalname}`,
              profilePicture: theResult,
            },
          },
          { upsert: false, returnDocument: "before" } // Ensure no new document is created if the required document does not exist, and the returned document will be BEFORE the update is made
        );

        // The reason why I ensured the ORIGINAL document is returned, rather than the updated document is because, I want to get the old profile pic and delete
        // This ensures ONLY one request is sent during in operation
        const oldProfilePicture = user?.profilePicture;

        //  Delete older profile picture from the profile pic directory, to ensure junk (unused) files don't fill the directory
        if (oldProfilePicture) {
          // IN PRODUCTION - Delete from cloudinary. The 'delete_resources' takes a list of all the items to delete
          await cloudinary.api.delete_resources(
            [
              `${oldProfilePicture.replace(
                "https://res.cloudinary.com/drqepxmnc/image/upload/v1735797683/",
                ""
              )}`,
            ],
            {
              resource_type: "image",
            }
          );

          // IN DEVELOPMENT - Delete from the local profile pic directory
          // deleteOldProfilePic(`${profilePicDirectory}/${oldProfilePicture}`);
        }

        // If we got a user, return the user, with a 200 status code, else return an error.
        if (user) {
          return res.status(200).json({
            id: user?._id,
            email: user?.email,
            phoneNumber, // NOTE: We returned the phone number sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.phoneNumber')
            fullName, // NOTE: We returned the full name sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.fullName')
            profilePicture: theResult, // NOTE: We returned the profile pic sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.profilePicture')
            // profilePicture: `${profilePic?.originalname}`, // NOTE: We returned the profile pic sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.profilePicture')
            dateJoined: user?.dateJoined,
          });
        } else {
          return res.sendStatus(400);
        }
      } else {
        return res.sendStatus(400);
      }

      // If the user is NOT updating their profile pic
    } else if (phoneNumber && fullName) {
      // Get the logged in user, and change their name and phone number. This ensures another user does not change another user's details
      const user = await usersCollection.findOneAndUpdate(
        { email: req.user?.email },
        {
          $set: {
            fullName,
            phoneNumber,
          },
        },
        { upsert: false, returnDocument: "after" } // Ensure no new document is created if the required document does not exist, and the returned document will be after
      );

      // If we got a user, return the user, with a 200 status code, else return an error.
      if (user) {
        return res.status(200).json({
          id: user?._id,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          fullName: user?.fullName,
          dateJoined: user?.dateJoined,
          profilePicture: user?.profilePicture,
        });
      }

      return res.sendStatus(400);
    } else {
      return res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export default EditUser;
