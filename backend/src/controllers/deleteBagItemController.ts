import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const DeleteBagItem = async (req: Request, res: Response) => {
  try {
    const userBag = req.user?.bag; // Get the user's bag
    const { productID } = req.params; // Get the product's ID from the body

    // Check if the user have products in their bag and if the productID is included in their bag
    if (userBag?.length && productID && userBag.includes(productID)) {
      // Convert the bag array to a set for faster lookup and deletion
      // Time Complexity: O(1) for lookup and O(1) for removal.
      const theBagSet = new Set(userBag);

      const productRemoved = theBagSet.delete(productID); // Returns true if an element in the Set existed and has been removed, or false if the element does not exist.

      if (productRemoved) {
        const newBag = Array.from(theBagSet); // 'Array.from' converts an array-like object to an array. So here, we converted the set to an array

        // Get the users collection
        const usersCollection =
          udohsDatabase.collection<UserCollection>("users");

        // Then we update the user's bag, with the new bag array
        const updateBag = await usersCollection.updateOne(
          { _id: new ObjectId(req.user?._id) },
          { $set: { bag: newBag } },
          { upsert: false }
        );

        if (updateBag.modifiedCount === 1) {
          return res.sendStatus(200);
        }
      }
    }

    // If one of the 'if' blocks above did not execute, we return a 400 status
    return res.sendStatus(400);
  } catch {
    return res.sendStatus(400);
  }
};

export default DeleteBagItem;
