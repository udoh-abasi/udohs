import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { IoChatboxOutline, IoLocationOutline } from "react-icons/io5";
import { MdWorkspacePremium } from "react-icons/md";

const ItemDisplay = () => {
  // const changeThumbWidth = () => {
  //   const element = document.querySelectorAll("li.thumb");
  //   console.log(element);
  //   element.forEach((el) => {
  //     el.style.width = "140px";
  //   });
  // };

  // changeThumbWidth();

  const number = 9888888888.97;

  return (
    <main>
      <div className="relative">
        <div className="min-[1120px]:grid grid-cols-[2fr_350px] grid-rows-1">
          <section className="p-4 min-[600px]:grid grid-cols-2 grid-rows-1 gap-3 min-[1120px]:block col-start-2 col-end-3 row-start-1 row-end-2 min-[1120px]:sticky z-10 top-5 max-w-[855px] mx-auto my-0 h-fit">
            <article className="mb-4 p-4 rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <p className="text-center font-bold text-2xl break-all mb-2">
                &#8358; {number.toLocaleString("en-US")}
              </p>

              <div className="my-4 flex justify-center">
                <figure className="grid grid-cols-[auto_minmax(0,100%)] items-center">
                  <div className="relative">
                    <div className="rounded-full overflow-hidden mr-4 w-[40px] h-[40px]">
                      <img
                        alt={``}
                        src={`/Profile_Image_Placeholder-small.jpg`}
                      />
                    </div>
                  </div>

                  <figcaption className="font-bold text-left break-all">
                    <p>{"Udoh Abasiono Sunday"}</p>
                  </figcaption>
                </figure>
              </div>

              <p className="text-center -mt-4 mb-4">
                <small className="text-black block">
                  <MdWorkspacePremium className="inline" />
                  Joined Udohs: {`May 2024`}
                  <MdWorkspacePremium className="inline" />
                </small>
              </p>

              <Link
                className="text-center block font-bold text-2xl"
                to={`tel:08142622350`}
              >
                08142622350
              </Link>

              <Link
                className="text-center block font-bold break-all"
                to={`mailto:udohabasi@gmail.com`}
              >
                {" "}
                udohabasi@gmail.com
              </Link>

              <div className="flex justify-center font-bold">
                <button
                  type="button"
                  className="flex justify-center items-center gap-2 rounded-full ring-2 ring-white py-2 px-16 my-4 mt-6"
                >
                  {" "}
                  <IoChatboxOutline className="text-2xl" />{" "}
                  <span>Start Chat</span>
                </button>
              </div>
            </article>

            <article className="mb-4 p-4 rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <h3 className="Anton text-center text-2xl tracking-wider mb-4">
                Safety tips
              </h3>

              <ul className="list-outside list-disc ml-2 flex flex-col gap-2">
                {/* <li>
                <strong>Never make payments in advance:</strong> Always withhold
                any payment until you have verified the item in person.
              </li>
              <li>
                <strong>Arrange to meet in a secure, public location:</strong>{" "}
                Ensure that all exchanges occur in well-populated and safe
                areas.
              </li>
              <li>
                <strong>Thoroughly examine the item before purchasing:</strong>{" "}
                Carefully review the product to confirm it meets your
                requirements and expectations.
              </li>
              <li>
                <strong>
                  Verify all documentation and only proceed with payment if
                  completely satisfied:
                </strong>
                Check all relevant paperwork and make the payment only after you
                are fully convinced of the item's legitimacy and condition.
              </li> */}

                <li>
                  <strong>Never make payments in advance</strong>
                </li>
                <li>
                  <strong>Arrange to meet in a secure, public location</strong>
                </li>
                <li>
                  <strong>Thoroughly examine the item before purchasing</strong>
                </li>
                <li>
                  <strong>
                    Verify all documentation and only proceed with payment if
                    completely satisfied
                  </strong>
                </li>
              </ul>
            </article>
          </section>

          <div className="flex flex-col items-center justify-cente my-4 col-start-1 col-end-2 row-start-1 row-end-2">
            <Carousel
              autoPlay={false}
              infiniteLoop={true}
              showThumbs={true}
              showArrows={true}
              showIndicators={true}
              showStatus={true}
              swipeable={false}
              useKeyboardArrows={true}
              animationHandler="fade"
              swipeScrollTolerance={5}
              // interval={100}
              transitionTime={800}
              stopOnHover={false}
              thumbWidth={140}
              // width={"80%"}
              // centerMode={true}
              // centerSlidePercentage={93}
              // centerSlidePercentage={88}
              className="w-[95%] max-[600px]:w-[95%] max-w-[715px"
            >
              <picture className="row-start-1 col-start-1" key={1}>
                <img src="/products/product 1.jpg" alt="A happy family" />
              </picture>

              <picture className="row-start-1 col-start-1" key={2}>
                <img src="/products/product 2.jpg" alt="A happy family" />
              </picture>

              <picture className="row-start-1 col-start-1" key={3}>
                <img src="/products/product 3.jpg" alt="A happy family" />
              </picture>

              <picture className="row-start-1 col-start-1" key={4}>
                <img src="/products/product 4.jpg" alt="A happy family" />
              </picture>

              <picture className="row-start-1 col-start-1" key={5}>
                <img src="/products/product 5.jpg" alt="A happy family" />
              </picture>
            </Carousel>

            <article className="p-4">
              <p className="font-bold text-xl mb-4">
                TVolkswagen Tiguan 1.4 TSI 2008 White
              </p>
              <p className="flex items-center italic mb-4 gap-1">
                {" "}
                <IoLocationOutline /> <small>Lagos Nigeria</small>
              </p>
              <p className="text-justify max-w-[600px]">
                The description of the item Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </article>
          </div>
        </div>
      </div>

      <section className="my-16">
        <h2 className="Anton text-center text-4xl max-[420px]:text-2xl px-4 font-bold uppercase mb-8 tracking-[0.2em]">
          Similar Products
        </h2>

        <ul className="p-4 min-[460px]:grid grid-cols-2 min-[700px]:grid-cols-3 min-[1000px]:grid-cols-4 gap-[16px] justify-items-center">
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
      </section>
    </main>
  );
};

export default ItemDisplay;
