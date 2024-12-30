import { Link, useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { FaLandmark, FaMobileScreen } from "react-icons/fa6";
import { MdOutlineLaptopMac, MdDevicesOther } from "react-icons/md";
import { LuMonitorPlay } from "react-icons/lu";
import { GiClothes } from "react-icons/gi";
import { BiSearchAlt } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../utils/tsInterface";
import axiosClient from "../utils/axiosSetup";
import Loader from "../utils/loader";
import { BsFillArrowUpCircleFill } from "react-icons/bs";

const AllItems = () => {
  // Holds the search input value
  const [searchInputValue, setSearchInputValue] = useState("");

  // Holds the order, whether by title or the date added
  const [sortBy, setSortBy] = useState<"title" | "dateAdded">("dateAdded");

  // Holds the sort type. Whether ascending or descending.
  const [order, setOrder] = useState<"asc" | "desc">("desc"); // Default is descending (from Z - A)

  // Holds the nextPage number, sent by the backend
  const [nextPage, setNextPage] = useState<number>();

  const navigate = useNavigate();

  // This holds the products sent by the backend
  const [products, setProducts] = useState<Product[]>([]);

  const [category, setCategory] = useState<Product["category"] | "">("");

  // Set this to true by default, so that on page load, the Loader will show, while we are sending a request to get the product
  const [requestLoading, setRequestLoading] = useState(true);

  // Set to true when request is sent to get the next page
  const [nextProductLoading, setNextProductLoading] = useState(false);

  // This useEffect runs on page load to get the first set of products from the backend
  useEffect(() => {
    const getAllProduct = async () => {
      try {
        setRequestLoading(true);

        const response = await axiosClient.get(
          `/api/product?order=${order}&sortBy=${sortBy}&category=${category}`
        );

        if (response.status === 200) {
          // Get the response product
          const responseProducts = response.data.products;

          // Set the products
          setProducts([...responseProducts]);

          // Set the next page number
          setNextPage(response.data.nextPage);

          setRequestLoading(false);
        }
      } catch {
        // If something went wrong, navigate the user to the 404 page
        navigate("/404");
      }
    };

    getAllProduct();
  }, [navigate, order, sortBy, category]);

  // This function runs to get the next products, as long as we have a nextPage number
  const getNextProducts = useCallback(async () => {
    try {
      if (nextPage) {
        setNextProductLoading(true);

        const response = await axiosClient.get(
          `/api/product?neededPage=${nextPage}&order=${order}&sortBy=${sortBy}&category=${category}`
        );

        const responseProducts = response.data.products;

        // Then set the products to the previous products result, and the latest result
        setProducts([...products, ...responseProducts]);

        // Set the next page
        setNextPage(response.data.nextPage);

        setNextProductLoading(false);
      }
    } catch {
      // If something went wrong, Do nothing.
    }
  }, [nextPage, products, sortBy, order, category]);

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
        <main>
          <form
            className="w-full flex justify-center p-4 pt-16 pb-8"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search?query=${searchInputValue}`);
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
              >
                <BiSearchAlt />
              </button>
            </div>
          </form>

          <div className="flex justify-center my-8 font-bold border-b-4 border-[black] pb-16 mb-16">
            <section className=" mx-4 flex justify-between max-w-[550px] w-full">
              <div className="max-[512px]:flex flex-col">
                <label
                  htmlFor="sortBy"
                  className="mr-4 text-lg min-[500px]:text-xl"
                >
                  Sort by
                </label>

                <select
                  value={sortBy}
                  id="sortBy"
                  onChange={(e) => {
                    if (e.target.value === "title") setSortBy("title");
                    else if (e.target.value === "dateAdded")
                      setSortBy("dateAdded");
                  }}
                  className="w-[120px] min-[490px]:w-[140px] min-[500px]:text-lg rounded-xl ring-2 ring-[#81ba40] p-1 text-black"
                >
                  <option value="title">Title</option>
                  <option value="dateAdded">Date Added</option>
                </select>
              </div>

              <div className="max-[512px]:flex flex-col ">
                <label
                  htmlFor="order"
                  className="mr-4 text-lg min-[500px]:text-xl"
                >
                  Order
                </label>

                <select
                  id="order"
                  value={order}
                  onChange={(e) => {
                    if (e.target.value === "asc") setOrder("asc");
                    else if (e.target.value === "desc") setOrder("desc");
                  }}
                  className="min-[500px]:w-[140px] w-[120px] min-[500px]:text-lg rounded-xl ring-2 ring-[#81ba40] p-1 text-black"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </section>
          </div>

          <section className="min-[600px]:grid grid-rows-1 grid-cols-[350px,auto] relative">
            <ul className="Anton text-lg tracking-widest bg-[#a1d06d] p-4 rounded-2xl m-4 min-[600px]:ml-4 min-[600px]:m-0 row-start-1 row-end-1 col-start-1 col-end-1 h-fit static min-[600px]:sticky top-10 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <li>
                <button
                  type="button"
                  className={`w-full text-left pb-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "vehicle" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("vehicle");
                  }}
                >
                  <FaCar className="text-xl text-[black]" />
                  Vehicles
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className={`w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "phone" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("phone");
                  }}
                >
                  <FaMobileScreen className="text-xl text-[black] font-bold" />
                  Mobile Phone & Accessories
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className={`w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "computer" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("computer");
                  }}
                >
                  <MdOutlineLaptopMac className="text-xl text-[black]" />
                  Computer & Accessories
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className={`w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "homeAppliances" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("homeAppliances");
                  }}
                >
                  <LuMonitorPlay className="text-xl text-[black]" />
                  Home appliances
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className={`w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "fashion" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("fashion");
                  }}
                >
                  <GiClothes className="text-xl text-[black]" />
                  Fashion
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className={`w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "properties" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("properties");
                  }}
                >
                  <FaLandmark className="text-xl text-[black]" />
                  Properties
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className={`w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase ${
                    category == "others" && "text-black"
                  }`}
                  onClick={() => {
                    setCategory("others");
                  }}
                >
                  <MdDevicesOther className="text-xl text-[black]" />
                  Others
                </button>
              </li>
            </ul>

            <div className="row-start-1 row-end-1 col-start-2 col-end-3">
              <ul className="p-4 pt-0 min-[460px]:grid grid-cols-1 max-[599.9px]:grid-cols-2 min-[810px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-[16px] justify-items-center">
                {products.map((product) => {
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
            </div>
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

export default AllItems;
