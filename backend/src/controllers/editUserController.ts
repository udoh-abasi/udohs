import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { imageDirectory } from "../index";

// This function deletes the old profile picture (if it exist), when a user uploads a new one
const deleteOldProfilePic = (thePicPath: string) => {
  fs.unlink(thePicPath, (err) => {
    if (err) {
      // Do nothing, because I don't want this to affect the outcome to the client
    }
  });
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
      // Get the directory where profile pic are stored. On development, if you console.log this 'profilePicDirectory', you will see 'C:\Users\dell\Desktop\udohs\backend/src/public/profileImages'
      const profilePicDirectory = path.join(imageDirectory, "profileImages/"); // NOTE: 'imageDirectory' is defined in 'index.ts' file, and it points to the folder where we have images. We just joined it with 'profileImages', to get the profile image folder

      // This holds the cropped image by sharp
      let theCroppedImage: sharp.OutputInfo;

      try {
        // Try to save the image into the profile pic directory
        theCroppedImage = await sharp(profilePic?.buffer)
          .resize(300, 300, { fit: sharp.fit.inside, withoutEnlargement: true })
          .toFile(`${profilePicDirectory}/${profilePic?.originalname}`); // NOTE: We used the original name sent by the frontend here
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
                fs.mkdirSync(profilePicDirectory, { recursive: true }); // NOTE: Setting 'recursive' to true is necessary, if not there will be errors, because, currently, we have the src folder, and we are trying to create two new folders (i.e, public and profileImages), so, we have to do that recursively
              }

              // Then we try to save the image into the profile pic directory again
              theCroppedImage = await sharp(profilePic?.buffer)
                .resize(300, 300, {
                  fit: sharp.fit.inside,
                  withoutEnlargement: true,
                })
                .toFile(`${profilePicDirectory}/${profilePic?.originalname}`);
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
        // Get the logged in user, and change their name and phone number and profile pic. This ensures another user does not change another user's details
        const user = await usersCollection.findOneAndUpdate(
          { email: req.user?.email },
          {
            $set: {
              fullName,
              phoneNumber,
              profilePicture: `${profilePic?.originalname}`,
            },
          },
          { upsert: false, returnDocument: "before" } // Ensure no new document is created if the required document does not exist, and the returned document will be BEFORE the update is made
        );

        // The reason why I ensured the ORIGINAL document is returned, rather than the updated document is because, I want to get the old profile pic and delete
        // This ensures ONLY one request is sent during in operation
        const oldProfilePicture = user?.profilePicture;

        // Delete older profile picture from the profile pic directory, to ensure junk (unused) files don't fill the directory
        if (oldProfilePicture) {
          deleteOldProfilePic(`${profilePicDirectory}/${oldProfilePicture}`);
        }

        // If we got a user, return the user, with a 200 status code, else return an error.
        if (user) {
          return res.status(200).json({
            id: user?._id,
            email: user?.email,
            phoneNumber, // NOTE: We returned the phone number sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.phoneNumber')
            fullName, // NOTE: We returned the full name sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.fullName')
            profilePicture: `${profilePic?.originalname}`, // NOTE: We returned the profile pic sent by the frontend, instead of the one returned by mongodb (so, we did NOT do 'user?.profilePicture')
            dateJoined: user?.dateJoined,
          });
        } else {
          return res.sendStatus(400);
        }
      } else {
        return res.sendStatus(400);
      }

      // If the user is not updating their profile pic
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
