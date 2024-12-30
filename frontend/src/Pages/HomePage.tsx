import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosSetup";
import Loader from "../utils/loader";
import { Product } from "../utils/tsInterface";

const HomePage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["trendingSales"],
    queryFn: async () => {
      return (await axiosClient.get("/api/trendingsales")).data;
    },
  });

  return (
    <main>
      <div className="grid grid-cols-1 grid-rows-1">
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          swipeable={false}
          useKeyboardArrows={false}
          animationHandler="fade"
          swipeScrollTolerance={5}
          interval={5000}
          transitionTime={1000}
          stopOnHover={false}
          // centerMode={true}
          // centerSlidePercentage={93}
          // centerSlidePercentage={88}
          className="bg-[rgb(255,255,255,.3)] col-start-1 col-end-1 row-start-1 row-end-1"
        >
          <picture className="row-start-1 col-start-1" key={1}>
            <source
              srcSet="/homepage/homePageImage1-big.webp"
              media="(min-width:520px)"
            />
            <source
              srcSet="/homepage/homePageImage1-small.webp"
              media="(max-width:519.999px)"
            />
            <img src="/homepage/homePageImage1-big.webp" alt="A happy family" />
          </picture>

          <picture className="row-start-1 col-start-1" key={2}>
            <source
              srcSet="/homepage/homePageImage3-big.webp"
              media="(min-width:520px)"
            />
            <source
              srcSet="/homepage/homePageImage3-small.webp"
              media="(max-width:519.999px)"
            />
            <img src="/homepage/homePageImage3-big.webp" alt="A happy family" />
          </picture>

          <picture className="row-start-1 col-start-1" key={3}>
            <source
              srcSet="/homepage/homePageImage4-big.webp"
              media="(min-width:520px)"
            />
            <source
              srcSet="/homepage/homePageImage4-small.webp"
              media="(max-width:519.999px)"
            />
            <img src="/homepage/homePageImage4-big.webp" alt="A happy family" />
          </picture>

          <picture className="row-start-1 col-start-1" key={4}>
            <source
              srcSet="/homepage/homePageImage5-big.webp"
              media="(min-width:520px)"
            />
            <source
              srcSet="/homepage/homePageImage5-small.webp"
              media="(max-width:519.999px)"
            />
            <img src="/homepage/homePageImage5-big.webp" alt="A happy family" />
          </picture>

          <picture className="row-start-1 col-start-1" key={5}>
            <source
              srcSet="/homepage/homePageImage2-big.webp"
              media="(min-width:520px)"
            />
            <source
              srcSet="/homepage/homePageImage2-small.webp"
              media="(max-width:519.999px)"
            />
            <img src="/homepage/homePageImage2-big.webp" alt="A happy family" />
          </picture>
        </Carousel>

        <article className="DancingScript col-start-1 col-end-1 row-start-1 row-end-1 self-center text-center text-[9vw] min-[870px]:text-[75px] tracking-widest min-[520px]:leading-none">
          <p className="text-black drop-shadow-[2px_2px_#fff]">
            ...where buying and selling come together in perfect harmony.
          </p>
          {/* <p className="-mb-6 max-[617px]:mb-0">buy from real people,</p>
          <p className="-mb-6 max-[617px]:mb-0">sell to real people,</p>
          <p>for real.</p> */}
        </article>
      </div>

      <section className="my-16">
        <h2 className="Anton text-center text-4xl max-[360px]:text-3xl font-bold uppercase mb-8 tracking-[0.2em]">
          Trending sells
        </h2>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <></>
        )}

        {data ? (
          <ul className="p-4 min-[460px]:grid grid-cols-2 min-[700px]:grid-cols-3 min-[1000px]:grid-cols-4 gap-[16px] justify-items-center">
            {data.map((product: Product) => {
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
                        <p className="font-bold text-xl" id="one-line-ellipsis">
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
        ) : (
          <></>
        )}

        <div className="flex justify-center p-4 mt-8">
          <button
            type="button"
            className="Anton block uppercase ring-2 ring-white py-4 flex-[0_1_600px] text-xl rounded-full font-bold tracking-[0.3em] hover:bg-[#ffa001] transition-colors ease-out duration-500"
            onClick={() => {
              navigate("/items");
            }}
          >
            View more
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
