import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";
import path from "path";
import { imageDirectory } from "..";
import sharp from "sharp";
import { ObjectId } from "mongodb";
import fs from "fs";
import { deleteTempImageFile, uploadToCloudinary } from "./editUserController";
import { v2 as cloudinary } from "cloudinary";

const EditProduct = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    let {
      category,
      country,
      state,
      currency,
      amount,
      title,
      description,
      oldPhotos,
      photoOrder,
    } = req.body;

    // Get the newly added image files
    const newlyAddedPhotos = req.files;

    category = category.trim();
    country = country.trim();
    state = state.trim();
    currency = currency.trim();
    amount = amount.trim();
    title = title.trim();
    description = description.trim();

    // Since the old photos and photo order were sent as a JSON stringified list of strings, (i.e the list was converted to a string using JSON.stringify), we have to convert it back to an actual list
    oldPhotos = JSON.parse(oldPhotos);
    photoOrder = JSON.parse(photoOrder);

    // Sort the photos in the 'photoOrder'. This will create a new list, rather than sorting the 'photoOrder' in-place
    const sortedPhotoOder = [...photoOrder].sort((obj1, obj2) => {
      const key1 = parseInt(Object.keys(obj1)[0]);
      const key2 = parseInt(Object.keys(obj2)[0]);

      return key1 - key2;
    });

    if (
      req.user?._id &&
      category &&
      country &&
      state &&
      currency &&
      amount &&
      title &&
      description &&
      (newlyAddedPhotos?.length || oldPhotos.length)
    ) {
      // Get the 'products' collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      // Get the directory where product Photos are stored. On development, if you console.log this 'productPhotosDirectory', you will see 'C:\Users\dell\Desktop\udohs\backend/src/public/productPhotos'
      // NOTE: 'imageDirectory' is defined in 'index.ts' file, and it points to the folder where we have all images (i.e 'C:\Users\dell\Desktop\udohs\backend/src/public'). We just joined it with 'productPhotos', to get the product Photos folder
      // const productPhotosDirectory = path.join(
      //   imageDirectory,
      //   "productPhotos/"
      // );

      // NOTE: In production, when you host on 'vercel', we have a temporary folder called 'tmp', where we can store temporary files.
      // If you try creating any other folder, you will get errors
      const tempDir = "/tmp";

      // Ensure the directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true }); // Create the temporary directory
      }

      // This holds all the images
      const allCroppedImages: string[] = [];

      // So, we check if 'newlyAddedPhotos' is an array, if not, TS will cause errors
      if (Array.isArray(newlyAddedPhotos) && newlyAddedPhotos?.length) {
        // NOTE: Because we are using 'await sharp' inside the loop, 'photos.map' will return a promise. This will make the 'allCroppedImages' array above to be empty when the request to insert the product in the database is sent.
        // To fix this, we have to wait for the loop to resolve, before we send the product to the database. That can be done by using 'await Promise.all' here
        await Promise.all(
          newlyAddedPhotos.map(async (eachFileBlob: Express.Multer.File) => {
            // This holds the cropped image by sharp
            let theCroppedImage: sharp.OutputInfo;

            // After resizing the image with sharp, we will temporarily store it in this path
            const resizedImagePath = path.join(
              tempDir,
              `${eachFileBlob.originalname}`
            );

            // Try to save the image into the directory
            theCroppedImage = await sharp(eachFileBlob?.buffer)
              .resize(1080, 780, {
                fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (1080x700) if the image's width or height is larger than 1080 or 780 respectively. If after shrinking, and let's say, the image is now 1080x600, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 1080x780
                position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
                background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
                withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 1080px or 780px respectively, if either the width or height is less
              })
              .toFile(resizedImagePath); // NOTE: We used the original name sent by the frontend here

            if (
              theCroppedImage.width === 1080 &&
              theCroppedImage.height === 780
            ) {
              // Upload the image to cloudinary. This returns the image link
              const theResult = await uploadToCloudinary(
                resizedImagePath,
                "productPhotos"
              );

              // Add the image's file link to the array
              allCroppedImages.push(theResult);

              // Delete the temp file
              deleteTempImageFile(resizedImagePath);

              // IN DEVELOPMENT - Add the image's file name to the array
              // allCroppedImages.push(eachFileBlob.originalname);
            }
          })
        );
      }

      // This will hold all the photos (both newly added photos and old photos)
      const allPhotos: string[] = [];

      // Here, we mapped through the sorted photo order, and append the photos to the 'allPhotos' list. This was done so we can preserve the order
      sortedPhotoOder.map((eachPhoto) => {
        // Get the value (which is a string of the photo).
        // NOTE: For newly added photos, the 'value' will be a string of just the image name e.g "Udoh_Abasi_2024-12-30T14-40-16.169Z"
        // However, if it is an old image (i.e, images sent by the frontend which do NOT require sharp's resizing), then the 'value' will be the full link from cloudinary e.g 'https://res.cloudinary.com/drqepxmnc/image/upload/v1735569620/productPhotos/resized-Udoh_Abasii_2024-12-30T14-40-16.169Z_f4dusz.jpg'
        const thePhotoString = Object.values(eachPhoto)[0];

        // Check whether the photo is either in the oldPhoto list or allCroppedImages list
        if (
          oldPhotos.includes(thePhotoString) ||
          allCroppedImages.includes(thePhotoString as string)
        ) {
          // If true, add it to the 'allPhotos' array
          allPhotos.push(thePhotoString as string);
        } else {
          // If 'thePhotoString' is NOT in the 'oldPhotos' array, that means it is probably in the 'allCroppedImages'
          // But the strings in the 'allCroppedImages' has the full link including cloudinary URL, while here, 'thePhotoString' is just the image name sent from the frontend (e.g "Udoh_Abasi_2024-12-30T14-40-16.169Z.jpg")
          // So first, we let TS know this is a string
          let theString = thePhotoString as string;

          // Take out the extension from the image name
          const photoStringWithoutExt = theString.slice(
            0,
            theString.lastIndexOf(".") // Since the image ends with '.jpg', we get the index of the last '.' and end the slice there
          );

          // Then find the string in the 'allCroppedImages' array.This will return the matched string (which is the URL link to the image on cloudinary)
          const theCompletePhotoLink = allCroppedImages.find((eachLink) =>
            eachLink.includes(photoStringWithoutExt)
          );

          // If we got the string, add it to 'allPhotos'
          if (theCompletePhotoLink) {
            allPhotos.push(theCompletePhotoLink);
          }
        }
      });

      if (allPhotos.length) {
        // If everything went well, send a request to find and update the product
        const result = await productsCollection.findOneAndUpdate(
          {
            productOwnerID: req.user?._id,
            _id: new ObjectId(productID),
          },
          {
            $set: {
              category,
              country,
              state,
              currency,
              amount,
              title,
              description,
              photos: allPhotos,
            },
          },
          {
            upsert: false,
            returnDocument: "before",
            projection: { _id: 1, photos: 1 },
          }
        );

        // Since we set 'returnDocument: "before", we will get the old product (before it was edited)
        if (result?._id) {
          // Get the previously saved photos
          const previouslySavedPhotos = result.photos;

          // IN PRODUCTION - We want to delete all old photos at once, so we store them here
          const photosToDelete: string[] = [];

          // Delete all the images that the user removed
          previouslySavedPhotos.map((eachImage) => {
            // If the image is not in 'allPhotos', we add it to the array of 'photosToDelete'
            if (!allPhotos.includes(eachImage)) {
              // First, we get the image's cloudinary public ID
              // NOTE: 'eachImage' is in the format 'https://res.cloudinary.com/drqepxmnc/image/upload/v1735806972/productPhotos/Udoh_Abasii_2025-01-02T08_36_10.938Z_s7a7vw.jpg'.
              // So, we want to extract the public ID from it, which in this case, is 'productPhotos/Udoh_Abasii_2025-01-02T08_36_10.938Z_s7a7vw'
              const publicID = eachImage.slice(
                eachImage.indexOf("productPhotos/"), // Remove everything before the 'productPhotos/'
                eachImage.lastIndexOf(".") // Remove everything after the last dot (including the last dot). This removes the image's extension
              );

              photosToDelete.push(publicID);

              // IN DEVELOPMENT - This is how we delete from the local directory. We delete the images one-by-one
              //  fs.unlink(
              //   `${productPhotosDirectory}/${eachImage}`,
              //   (err) => {
              //     if (err) console.log(err);
              //   }
              // );
            }
          });

          // Then we delete all the photos from cloudinary at once
          if (photosToDelete.length) {
            await cloudinary.api.delete_resources(photosToDelete, {
              resource_type: "image",
            });
          }

          // Return the product's ID
          return res.status(200).json({ productID: result._id });
        }
      }
    }

    return res.status(404).json({ message: "An error occurred" });
  } catch (error) {
    console.log(error);
    // console.log(JSON.stringify(error, null, 2));
    return res.status(404).json({ message: "An error occurred" });
  }
};

export default EditProduct;
