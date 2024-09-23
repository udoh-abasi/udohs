import { Router } from "express";
import passport from "passport";
import GetBagItems from "../controllers/getBagItemsController";
import DeleteBagItem from "../controllers/deleteBagItemController";
import AddBagItem from "../controllers/addBagItemController";

const router = Router();

// This get route returns all the products in the user's bag
router.get(
  "/bag",
  passport.authenticate("jwt", { session: false }),
  GetBagItems
);

// This delete route removes a product from the user's bag
router.delete(
  "/bag/:productID",
  passport.authenticate("jwt", { session: false }),
  DeleteBagItem
);

// This put route adds a product ID to the the user's 'bag' array
router.put(
  "/bag",
  passport.authenticate("jwt", { session: false }),
  AddBagItem
);

export default router;
