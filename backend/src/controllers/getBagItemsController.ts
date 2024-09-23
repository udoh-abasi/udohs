import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const GetBagItems = async (req: Request, res: Response) => {
  try {
    const userBag = req.user?.bag; // Get the user's bag

    // Check if the user have products in their bag
    if (userBag?.length) {
      // Since the productsID are a string, we map through it and return the object ID
      const productObjectID = userBag.map(
        (productID) => new ObjectId(productID)
      );

      // Get the 'products' collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      // Here, we used '$in'. It value is an array. So, it will loop through the array and return products that match the IDs in the array
      const productsInBag = await productsCollection
        .find(
          {
            _id: { $in: productObjectID },
          },
          {
            projection: {
              productOwnerID: 0,
              description: 0,
              dateAdded: 0,
              category: 0,
            },
          }
        )
        .toArray();

      return res.status(200).json(productsInBag);
    }

    // If the user have no items in their bag, return an empty array
    return res.status(200).json([]);
  } catch {
    return res.sendStatus(400);
  }
};

export default GetBagItems;
