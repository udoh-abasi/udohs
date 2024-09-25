import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection, UserCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const DeleteProduct = async (req: Request, res: Response) => {
  try {
    const userID = req.user?._id; // Get the user's bag
    const { productID } = req.params; // Get the product's ID from the body

    // Check if the user have products in their bag and if the productID is included in their bag
    if (userID && productID) {
      // Get the 'products' collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      // Ensure the logged in user is the one that uploaded the product
      const result = await productsCollection.deleteOne({
        productOwnerID: userID.toString(),
        _id: new ObjectId(productID),
      });

      if (result.deletedCount === 1) {
        return res.sendStatus(200);
      }
    }

    // If one of the 'if' blocks above did not execute, we return a 400 status
    return res.sendStatus(400);
  } catch {
    return res.sendStatus(400);
  }
};

export default DeleteProduct;
