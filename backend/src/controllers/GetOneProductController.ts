import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection, UserCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const GetOneProduct = async (req: Request, res: Response) => {
  try {
    const { productID } = req.params;

    if (productID) {
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
          return res.status(200).json({ product, productOwner });
        }
      }
    }

    return res.sendStatus(400);
  } catch {
    return res.sendStatus(400);
  }
};

export default GetOneProduct;
