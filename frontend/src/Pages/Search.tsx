import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../utils/tsInterface";
import axiosClient, { productImagesURL } from "../utils/axiosSetup";
import Loader from "../utils/loader";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

const Search = () => {
  // Holds the search input value
  const [searchInputValue, setSearchInputValue] = useState("");

  // Holds the nextPage number, sent by the backend
  const [nextPage, setNextPage] = useState<number>();

  const navigate = useNavigate();

  // Get the google's code from the user (URL) and send it to the backend
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  // This holds the products sent by the backend
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Set this to true by default, so that on page load, the Loader will show, while we are sending a request to get the product
  const [requestLoading, setRequestLoading] = useState(true);

  // Set to true when request is sent to get the next page
  const [nextProductLoading, setNextProductLoading] = useState(false);

  // This useEffect runs on page load to get the first set of products from the backend
  useEffect(() => {
    const searchProducts = async () => {
      try {
        setRequestLoading(true);

        const response = await axiosClient.get(
          `/api/search?searchQuery=${query}`
        );

        if (response.status === 200) {
          // Get the response product
          const responseProducts = response.data.theSearchResult;

          // Set the products
          setSearchResults([...responseProducts]);

          // Set the next page number
          setNextPage(response.data.nextPage);

          setRequestLoading(false);
        }
      } catch {
        // If something went wrong, navigate the user to the 404 page
        navigate("/404");
      }
    };

    searchProducts();
  }, [navigate, query]);

  // This function runs to get the next products, as long as we have a nextPage number
  const getNextProducts = useCallback(async () => {
    try {
      if (nextPage && !nextProductLoading) {
        setNextProductLoading(true);

        const response = await axiosClient.get(
          `/api/search?searchQuery=${query}&neededPage=${nextPage}`
        );

        const responseProducts = response.data.theSearchResult;

        // Then set the products to the previous products result, and the latest result
        setSearchResults([...searchResults, ...responseProducts]);

        // Set the next page
        setNextPage(response.data.nextPage);

        setNextProductLoading(false);
      }
    } catch {
      // If something went wrong, Do nothing.
    }
  }, [nextPage, query, searchResults, nextProductLoading]);

  // This useEffect implements the infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      // NOTE: scrollTop - is how far you are from the top of the window (so, when you scroll to the very top of the page, it is zero)
      // clientHeight - is the actual height of the screen (the viewport, i.e visible area)
      // scrollHeight - is the entire height of the page (including non-visible area)
      // So, scrollTop (when the user scrolls to the bottom page) + clientHeight === scrollHeight

      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;

      // Check if the item is close to the bottom. The '700' here means, 'check if the user has scrolled 700px away from the bottom'
      if (scrollTop + clientHeight >= scrollHeight - 700) {
        getNextProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [getNextProducts]);

  // This keeps track of the previous position that the user is
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);

  // This tracks if the user is scrolling up or down
  const [scrollDir, setScrollDir] = useState("");

  // This useEffect adds an event listener to listen to scroll events
  useEffect(() => {
    // Check if the user is currently scrolling up or down
    const checkScroll = () => {
      if (window.scrollY < previousScrollPosition) {
        setScrollDir("up");
      } else {
        setScrollDir("down");
      }
    };

    window.addEventListener("scroll", () => {
      setPreviousScrollPosition(window.scrollY);
      checkScroll();
    });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", () => {
        setPreviousScrollPosition(window.scrollY);
        checkScroll();
      });
    };
  }, [previousScrollPosition]);

  return (
    <>
      {requestLoading ? (
        <div className="min-h-screen grid place-items-center">
          <Loader />
        </div>
      ) : (
        <main className="min-h-screen">
          <form
            className="w-full flex justify-center p-4 pt-16 pb-8"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="relative w-full max-w-[550px] text-black">
              <input
                id="search-input-field"
                type="search"
                placeholder="I am looking for..."
                required
                value={searchInputValue}
                className="w-full block border-black border-2 rounded-3xl h-12 p-2"
                onChange={(e) => {
                  setSearchInputValue(e.target.value);
                }}
              />
              <button
                type="submit"
                aria-label="Submit"
                title="Search"
                className="text-3xl text-black absolute right-2 top-3"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/search?query=${searchInputValue}`);
                }}
              >
                <BiSearchAlt />
              </button>
            </div>
          </form>

          <section className="min-[600px]:gri grid-rows-1 grid-cols-1 relative">
            {searchResults.length ? (
              <>
                <ul className="p-4 pt-0 grid grid-cols-1 min-[460px]:grid-cols-2 min-[810px]:grid-cols-3 min-[1150px]:grid-cols-4 gap-[16px] justify-items-center">
                  {searchResults.map((product) => {
                    const heroPhoto = product.photos[0];

                    return (
                      <li className="max-[460px]:mb-8" key={product._id}>
                        <Link
                          to={`/item/${product._id}`}
                          className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                        >
                          <figure>
                            <div>
                              <img
                                alt=""
                                src={`${productImagesURL}/${heroPhoto}`}
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
                      </li>
                    );
                  })}
                </ul>

                <div id="seeMore">
                  {nextPage && (
                    <div className="flex justify-center my-10">
                      <button
                        type="button"
                        onClick={() => {
                          if (nextPage) {
                            getNextProducts();
                          }
                        }}
                        disabled={nextProductLoading}
                        className="px-4 flex justify-center items-center w-[200px] font-bold rounded-br-xl rounded-tl-xl py-2 ring-4 ring-[#70dbb8] hover:bg-[#70dbb8] hover:text-black transition-all duration-300 ease-linear shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                      >
                        {nextProductLoading ? (
                          <Loader />
                        ) : (
                          <span className="flex justify-center">See more</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="italic font-bold text-center p-4">
                No result found. Try another search term
              </p>
            )}
          </section>

          {previousScrollPosition > 200 && scrollDir === "up" && (
            <a
              href="#"
              className="flex items-center flex-col fixed bottom-14 z-50 right-2 text-black font-bold"
            >
              <BsFillArrowUpCircleFill className="text-3xl" /> To Top
            </a>
          )}
        </main>
      )}
    </>
  );
};

export default Search;
