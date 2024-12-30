import { Router } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";
import passport from "passport";

const router = Router();

// Return the the trending sales, to be displayed on the homepage
router.get(
  "/useradverts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get the 'products' collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      // This will return all the articles that the logged in user created
      const result = await productsCollection
        .find(
          { productOwnerID: req.user?._id },
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

      return res.status(200).json(result);
    } catch {
      return res.sendStatus(400);
    }
  }
);

export default router;
