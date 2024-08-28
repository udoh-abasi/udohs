import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";

const GetAllProduct = async (req: Request, res: Response) => {
  try {
    // Get the current page from the query. 'ParseInt' converts a string to integer, it also strips off trailing and leading white-spaces and zeros (0)
    const currentPage: number = parseInt(req.query.neededPage as string) || 1; // Defaults to 1

    // We can sort by the title or date added
    const sortBy: "title" | "dateAdded" =
      (req.query.sortBy as string) === "title" ? "title" : "dateAdded";

    // Get the sorting order
    const order: "asc" | "desc" =
      (req.query.order as string) === "asc" ? "asc" : "desc";

    // Get the sort direction, which can either be 1 (for ascending order i,e A-Z) OR -1 (for descending order i,e Z-A)
    const sortDirection: 1 | -1 = order === "asc" ? 1 : -1;

    // Get the category
    const theCategory = req.query.category;

    // This function checks if the category the user sent is one of which we are expecting
    const isValidCategory = (value: string) => {
      return [
        "vehicle",
        "phone",
        "computer",
        "homeAppliances",
        "fashion",
        "properties",
        "others",
      ].includes(value);
    };

    // Check if the category is valid else, the category will be an empty string
    const category: ProductCollection["category"] | "" = isValidCategory(
      theCategory as string // Pass in the argument as a string
    )
      ? (theCategory as ProductCollection["category"]) // Set category here. We must state that it will have to be a value of the ProductCollection's category field, if not, TS will raise an error
      : "";

    // Get the maximum number of items to return
    const limit = 1;

    // Get the 'products' collection
    const productsCollection =
      udohsDatabase.collection<ProductCollection>("products");

    // This is the filter. We first check if there was a category, so we ensure we only get results in that category
    const theFilter = category ? { category } : {};

    // Get total number of documents
    const totalItems = await productsCollection.countDocuments(theFilter);

    // Get the products
    const products = await productsCollection
      .find(theFilter, {
        projection: { productOwnerID: 0, description: 0 },
      })
      .sort(sortBy, sortDirection)
      .skip(currentPage - 1) // Skip all the items that we already have sent to the frontend
      .limit(limit) // Limit the result, so all won't be sent at once. Here, we set the limit to six (6), so only six items will be sent
      .toArray(); // This helps make the actual request, and return the result as an array

    // Get nextPage number
    const nextPage = currentPage < totalItems ? currentPage + limit : null;

    // Get the previous page
    const previousPage = currentPage > 1 ? currentPage - limit : null;

    return res.status(200).json({
      products,
      nextPage,
      previousPage,
      currentPage,
    });
  } catch {
    return res.sendStatus(400);
  }
};

export default GetAllProduct;
