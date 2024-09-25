import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection, UserCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const GetOneProduct = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    if (productID) {
      // Get the signed in user's bag
      const signedInUserBag = req.user?.bag;

      let inBag = false; // Defaults to false

      // Check if the user is signed in, and if the the requested product is in the user's bag
      if (signedInUserBag?.length) {
        inBag = signedInUserBag.includes(productID);
      }

      // Get the 'products' collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      const product = await productsCollection.findOne({
        _id: new ObjectId(productID),
      });

      if (product) {
        // Get the 'users' collection
        const usersCollection =
          udohsDatabase.collection<UserCollection>("users");

        const productOwner = await usersCollection.findOne(
          {
            _id: new ObjectId(product.productOwnerID),
          },
          { projection: { password: 0, providerID: 0, provider: 0 } } // We want to send everything except password, provider and providerID fields
        );

        if (productOwner) {
          // Get 4 similar products to display on the page
          // Since we do not want to include the product that the user actually requested for in the similar products list, we used '$ne' (not equal) operator to exclude it
          // The command '_id: { $ne: product._id }' will exclude the product from the final result
          const similarProducts = await productsCollection
            .find(
              { category: product.category, _id: { $ne: product._id } },
              {
                projection: {
                  productOwnerID: 0,
                  description: 0,
                  dateAdded: 0,
                  category: 0,
                },
              }
            )
            .limit(4)
            .toArray();

          return res
            .status(200)
            .json({ product, productOwner, inBag, similarProducts });
        }
      }
    }

    return res.sendStatus(400);
  } catch {
    return res.sendStatus(400);
  }
};

export default GetOneProduct;
