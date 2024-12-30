import { Link, useNavigate } from "react-router-dom";
import Loader from "../utils/loader";
import { useCallback } from "react";
import axiosClient from "../utils/axiosSetup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../utils/tsInterface";

const Bag = () => {
  const navigate = useNavigate();

  // This will be used to set the data of useQuery (using queryClient.setQueryData). Similar to 'setData', when using 'useState'
  const queryClient = useQueryClient();

  // This is just a function that we will call to get all the products in the user's bag
  const getBagProducts = useCallback(async () => {
    const response = await axiosClient.get("/api/bag");

    // NOTE: here, we returned the data
    return response.data;
  }, []);

  // Here, we used useQuery to simplify getting the error, data, and loading state
  // NOTE: isLoading Is the same as isFetching && isPending
  // NOTE: The 'queryKey' takes a list, where the first item is the key, while the rest of the items will be variables which if their value changes, the function will be called again
  // NOTE: The 'queryFn' returns the a promise, that if fulfilled, becomes the data
  const { isLoading, data, isError } = useQuery({
    queryKey: ["bag"],
    queryFn: async () => {
      return await getBagProducts();
    },
  });

  // This will be true on page load
  if (isLoading)
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader />
      </div>
    );

  // If an error occurred, we want to navigate to the home page
  if (isError) {
    navigate("/");
  }

  // If everything went well, we return this, where we usex the data
  return (
    <>
      <div className="mt-16 min-h-screen">
        <section className="my-16 min-[600px]:my-0">
          <h2 className="Anton text-center text-4xl max-[420px]:text-2xl px-4 font-bold uppercase mb-8 tracking-[0.2em]">
            My Bag
          </h2>

          <ul className="p-4 pt-0 grid grid-cols-1 min-[460px]:grid-cols-2 min-[810px]:grid-cols-3 min-[1150px]:grid-cols-4 gap-[16px] justify-items-center">
            {data.length ? (
              data.map((product: Product) => {
                const heroPhoto = product.photos[0];

                return (
                  <li
                    className="max-[460px]:mb-8 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                    key={product._id}
                  >
                    <Link
                      to={`/item/${product._id}`}
                      className="block px-2 py-5 relative hover:bg-[#d1b5a6] rounded-t-2xl"
                    >
                      <figure>
                        <div>
                          <img
                            alt=""
                            src={`${heroPhoto}`}
                            className=" rounded-2xl"
                          />
                        </div>

                        <figcaption className="text-center mt-4">
                          <p className="font-bold text-xl mb-4">
                            {String.fromCharCode(Number(product.currency))}
                            {product.amount}
                          </p>

                          <p
                            className="font-bold text-xl"
                            id="one-line-ellipsis"
                          >
                            {product.title}
                          </p>

                          <p className="absolute top-0 text-sm font-bold">
                            <em>
                              {product.state}, {product.country}
                            </em>
                          </p>
                        </figcaption>
                      </figure>
                    </Link>

                    <div className="flex justify-center p-4 border-t-2 border-white">
                      <button
                        type="button"
                        className="block text-xl rounded-lg hover:ring-2 ring-red-500 text-red-500 px-7 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                        onClick={async () => {
                          // First, we want to quickly remove the deleted data from the frontend
                          const newData = data.filter(
                            (eachProduct: Product) =>
                              eachProduct._id !== product._id
                          );

                          // NOTE: This sets the useQuery's data to our new data
                          queryClient.setQueryData(["bag"], newData);

                          // Then we send a request to the backend to delete the data
                          try {
                            await axiosClient.delete(`/api/bag/${product._id}`);
                          } catch {
                            // Do nothing
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-xl italic font-bold text-black">
                Your bag is empty
              </p>
            )}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Bag;
