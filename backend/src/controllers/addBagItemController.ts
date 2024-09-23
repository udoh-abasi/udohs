import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const AddBagItem = async (req: Request, res: Response) => {
  try {
    const userBag = req.user?.bag; // Get the user's bag
    const { productID } = req.body; // Get the product's ID from the body

    if (userBag && productID) {
      const newBag = [...userBag, productID]; // We used spread operator to append the new ID to the end of the array

      // Get the users collection
      const usersCollection = udohsDatabase.collection<UserCollection>("users");

      // Then we update the user's bag, with the new bag array
      const updateBag = await usersCollection.updateOne(
        { _id: new ObjectId(req.user?._id) },
        { $set: { bag: newBag } },
        { upsert: false }
      );

      if (updateBag.modifiedCount) {
        return res.sendStatus(200);
      }
    }

    // If one of the 'if' blocks above did not execute, return a 400 status
    return res.sendStatus(400);
  } catch {
    return res.sendStatus(400);
  }
};

export default AddBagItem;
