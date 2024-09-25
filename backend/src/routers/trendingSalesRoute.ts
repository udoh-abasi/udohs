import { Router } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";

const router = Router();

// Return the the trending sales, to be displayed on the homepage
router.get("/trendingsales", async (req, res) => {
  try {
    // Get the 'products' collection
    const productsCollection =
      udohsDatabase.collection<ProductCollection>("products");

    // This will return the top four most expensive products
    const result = await productsCollection
      .find(
        {},
        {
          projection: {
            productOwnerID: 0,
            description: 0,
            dateAdded: 0,
            category: 0,
          },
        }
      )
      .sort("amount", -1)
      .limit(4)
      .toArray();

    return res.status(200).json(result);
  } catch {
    return res.sendStatus(400);
  }
});

export default router;
