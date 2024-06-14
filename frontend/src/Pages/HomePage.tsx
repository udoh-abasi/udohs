import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

const HomePage = () => {
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
          interval={6000}
          transitionTime={3000}
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

      <article>
        <h2>Trending</h2>

        <ul>
          <li>
            <Link to="">
              <figure className="">
                <div className="">
                  <img alt="" src="/heroImages/Hero photo-small.webp" />
                </div>

                <figcaption>
                  <p>$2,000</p>
                  <p>Toyota Corolla 2024 Model</p>
                  <p>Abuja, Nigeria</p>
                </figcaption>
              </figure>
            </Link>
          </li>
        </ul>
      </article>
    </main>
  );
};

export default HomePage;
