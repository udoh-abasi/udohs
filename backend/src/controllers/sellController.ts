import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";
import path from "path";
import { imageDirectory } from "..";
import sharp from "sharp";
import fs from "fs";

const Sell = async (req: Request, res: Response) => {
  try {
    let { category, country, state, currency, amount, title, description } =
      req.body;

    // Get the image files
    const photos = req.files;

    category = category.trim();
    country = country.trim();
    state = state.trim();
    currency = currency.trim();
    amount = amount.trim();
    title = title.trim();
    description = description.trim();

    if (
      req.user?._id &&
      category &&
      country &&
      state &&
      currency &&
      amount &&
      title &&
      description &&
      photos?.length
    ) {
      // Get the 'products' collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      // Get the directory where product Photos are stored. On development, if you console.log this 'productPhotosDirectory', you will see 'C:\Users\dell\Desktop\udohs\backend/src/public/productPhotos'
      // NOTE: 'imageDirectory' is defined in 'index.ts' file, and it points to the folder where we have all images (i.e 'C:\Users\dell\Desktop\udohs\backend/src/public'). We just joined it with 'productPhotos', to get the product Photos folder
      const productPhotosDirectory = path.join(
        imageDirectory,
        "productPhotos/"
      );

      // So, we check if 'photos' is an array, if not, TS will cause errors
      if (Array.isArray(photos)) {
        // This holds all the images
        const allCroppedImages: string[] = [];

        // NOTE: Because we are using 'await sharp' inside the loop, 'photos.map' will return a promise. This will make the 'allCroppedImages' array above to be empty when the request to insert the product in the database is sent.
        // To fix this, we have to wait for the loop to resolve, before we send the product to the database. That can be done by using 'await Promise.all' here
        await Promise.all(
          photos.map(async (eachFileBlob: Express.Multer.File) => {
            // This holds the cropped image by sharp
            let theCroppedImage: sharp.OutputInfo;

            try {
              // Try to save the image into the directory
              theCroppedImage = await sharp(eachFileBlob?.buffer)
                .resize(1080, 780, {
                  fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (1080x700) if the image's width or height is larger than 1080 or 780 respectively. If after shrinking, and let's say, the image is now 1080x600, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 1080x780
                  position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
                  background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
                  withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 1080px or 780px respectively, if either the width or height is less
                })
                .toFile(
                  `${productPhotosDirectory}/${eachFileBlob?.originalname}`
                ); // NOTE: We used the original name sent by the frontend here

              if (
                theCroppedImage.width === 1080 &&
                theCroppedImage.height === 780
              ) {
                // Add the image's file name to the array
                allCroppedImages.push(eachFileBlob.originalname);
              }
            } catch (e) {
              // NOTE: An error will occur if the productPhotos directory does not exist, as sharp does not create directories for us, if they DO NOT exist
              if (
                // This is done to prevent typescript errors
                typeof e === "object" &&
                e &&
                "message" in e &&
                typeof e.message === "string"
              ) {
                // Check if the error message contains the text 'unable to open for write', if true, that means the productPhotos directory does not exist
                if (
                  e.message.toLowerCase().includes("unable to open for write")
                ) {
                  try {
                    // Check if the directory does NOT exist for real
                    const folderAlreadyExist = fs.existsSync(
                      productPhotosDirectory
                    );

                    // If directory does not exist, then create it
                    if (!folderAlreadyExist) {
                      fs.mkdirSync(productPhotosDirectory, { recursive: true }); // NOTE: Setting 'recursive' to true is necessary, if not there will be errors, because, currently, we have the src folder, and we are trying to create two new folders (i.e, public and productPhotos), so, we have to do that recursively
                    }

                    // Then we try to save the image into the productPhotos directory again
                    theCroppedImage = await sharp(eachFileBlob?.buffer)
                      .resize(1080, 780, {
                        fit: "contain", // This means, the image will be shrunk (without cutting out any part), to fit the specified dimensions (1080x700) if the image's width or height is larger than 1080 or 780 respectively. If after shrinking, and let's say, the image is now 1080x600, sharp will add extra padding (at the top and bottom, OR left and right as required), to ensure the image is 1080x780
                        position: "center", // A position strategy to use. Other options are top, right top, right, right bottom, bottom etc
                        background: { r: 255, g: 255, b: 255, alpha: 1 }, // Specify the background color to be used to fill the extra padding that sharp will add. This is just RGBA values, so we want white here
                        withoutEnlargement: true, // This means, we DO NOT want the image's width or height to enlarge to 1080px or 780px respectively, if either the width or height is less
                      })
                      .toFile(
                        `${productPhotosDirectory}/${eachFileBlob?.originalname}`
                      ); // NOTE: We used the original name sent by the frontend here

                    if (
                      theCroppedImage.width === 1080 &&
                      theCroppedImage.height === 780
                    ) {
                      // Add the image's file name to the array
                      allCroppedImages.push(eachFileBlob.originalname);
                    }
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
          })
        );

        if (allCroppedImages.length) {
          // If a new user was inserted successfully, then 'result.acknowledged' will be true
          const result = await productsCollection.insertOne({
            productOwnerID: req.user?._id,
            category,
            country,
            state,
            currency,
            amount,
            title,
            description,
            photos: allCroppedImages,
          });

          if (result.acknowledged) {
            // Return the product's ID
            return res.status(200).json({ productID: result.insertedId });
          }
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

export default Sell;
