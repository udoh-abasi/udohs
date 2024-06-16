import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { FaLandmark, FaMobileScreen } from "react-icons/fa6";
import { MdOutlineLaptopMac, MdDevicesOther } from "react-icons/md";
import { LuMonitorPlay } from "react-icons/lu";
import { GiClothes } from "react-icons/gi";
import { BiSearchAlt } from "react-icons/bi";
import { useState } from "react";

const AllItems = () => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const [sortBy, setSortBy] = useState("asc");
  const [order, setOrder] = useState("product");

  return (
    <main>
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
                setSortBy(e.target.value);
              }}
              className="w-[120px] min-[490px]:w-[140px] min-[500px]:text-lg rounded-xl ring-2 ring-[#81ba40] p-1 text-black"
            >
              <option value="Product">Product</option>
              <option value="date">Date Added</option>
            </select>
          </div>

          <div className="max-[512px]:flex flex-col ">
            <label htmlFor="order" className="mr-4 text-lg min-[500px]:text-xl">
              Order
            </label>

            <select
              id="order"
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
              }}
              className="min-[500px]:w-[140px] w-[120px] min-[500px]:text-lg rounded-xl ring-2 ring-[#81ba40] p-1 text-black"
            >
              <option value="asc">Ascending</option>
              <option value="des">Descending</option>
            </select>
          </div>
        </section>
      </div>

      <section className="min-[600px]:grid grid-rows-1 grid-cols-[300px,auto] relative">
        <ul className="Anton text-lg tracking-widest bg-[#a1d06d] p-4 rounded-2xl m-4 min-[600px]:ml-4 min-[600px]:m-0 row-start-1 row-end-1 col-start-1 col-end-1 h-fit static min-[600px]:sticky top-10 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <li>
            <button
              type="button"
              className="w-full text-left pb-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <FaCar className="text-xl text-[black]" />
              Vehicles
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <FaMobileScreen className="text-xl text-[black] font-bold" />
              Mobile & Accessories
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <MdOutlineLaptopMac className="text-xl text-[black]" />
              Computer & Accessories
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <LuMonitorPlay className="text-xl text-[black]" />
              Home appliances
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <GiClothes className="text-xl text-[black]" />
              Fashion
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <FaLandmark className="text-xl text-[black]" />
              Properties
            </button>
          </li>

          <li>
            <button
              type="button"
              className="w-full text-left py-4 border-b-2 border-b-[#c9a998] hover:text-[black] flex items-center gap-2 uppercase"
            >
              <MdDevicesOther className="text-xl text-[black]" />
              Others
            </button>
          </li>
        </ul>

        <div className="row-start-1 row-end-1 col-start-2 col-end-3">
          <ul className="p-4 pt-0 min-[460px]:grid grid-cols-1 max-[600px]:grid-cols-2 min-[700px]:grid-cols-2 min-[1000px]:grid-cols-3 gap-[16px] justify-items-center">
            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>

            <li className="max-[460px]:mb-8">
              <Link
                to=""
                className="block rounded-2xl px-2 py-5 relative hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
              >
                <figure>
                  <div>
                    <img
                      alt=""
                      src="/heroImages/Hero photo-small.webp"
                      className=" rounded-2xl"
                    />
                  </div>

                  <figcaption className="text-center mt-4">
                    <p className="font-bold text-xl mb-4">$2,000</p>
                    <p className="font-bold text-xl" id="one-line-ellipsis">
                      Toyota Corolla 2024 Model Corolla 2024 Model
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default AllItems;
