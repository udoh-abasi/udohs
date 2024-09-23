import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { ProductCollection } from "../utils/tsInterface";

// NOTE: Read about mongodb's search here - https://www.mongodb.com/docs/manual/reference/operator/query/text/#std-label-text-query-operator-behavior
const Search = async (req: Request, res: Response) => {
  try {
    // Get the search word and remove leading and trailing white-spaces
    let searchQuery = req.query.searchQuery as string;
    searchQuery = searchQuery.trim();

    // Get the current page from the query. 'ParseInt' converts a string to integer, it also strips off trailing and leading white-spaces and zeros (0)
    const currentPage: number = parseInt(req.query.neededPage as string) || 1; // Defaults to 1

    if (searchQuery) {
      // Get the maximum number of items to return
      const limit = 5;

      // Get the collection
      const productsCollection =
        udohsDatabase.collection<ProductCollection>("products");

      // Get total number of documents
      const totalItems = await productsCollection.countDocuments({
        $text: {
          $search: `'${searchQuery}'`, // Here, we provide the search query. Notice we wrapped it with a single quote (i.e '${searchQuery}'). This will match words every word, separated by space. E.g, if we searched for 'new word', we will get results that contains 'new word', 'new' AND 'word'. However, if we use double quote (i.e "${searchQuery}""), we will ONLY get results that contains 'new word'
        },
      });

      // Perform the search
      const theSearchResult = await productsCollection
        .find(
          {
            $text: {
              $search: `'${searchQuery}'`, // Here, we provide the search query. Notice we wrapped it with a single quote (i.e '${searchQuery}'). This will match words every word, separated by space. E.g, if we searched for 'new word', we will get results that contains 'new word', 'new' AND 'word'. However, if we use double quote (i.e "${searchQuery}""), we will ONLY get results that contains 'new word'
            },
          },
          { projection: { score: { $meta: "textScore" } } } // Here, we ensured mongoDB assigns a score to each result based on how close the result matches to the search query.
        )
        .sort({ score: { $meta: "textScore" }, title: 1 }) // NOTE: Here, we use the score to sort (in descending order). So, closely matched results will appear on top
        .skip(currentPage - 1)
        .limit(limit)
        .toArray();

      // Get nextPage number
      const nextPage = currentPage < totalItems ? currentPage + limit : null;

      // Get the previous page
      const previousPage = currentPage > 1 ? currentPage - limit : null;

      return res.status(200).json({
        theSearchResult,
        nextPage,
        previousPage,
        currentPage,
      });
    }

    return res.sendStatus(400);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
};

export default Search;
