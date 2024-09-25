import { Carousel } from "react-responsive-carousel";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoChatboxOutline, IoLocationOutline } from "react-icons/io5";
import { MdWorkspacePremium } from "react-icons/md";
import { TbShoppingBagHeart } from "react-icons/tb";
import { TbShoppingBagX } from "react-icons/tb";
import { useSelector } from "react-redux";
import { userSelector } from "../reduxFiles/selectors";
import { useEffect, useState } from "react";
import axiosClient, {
  productImagesURL,
  profilePictureURL,
} from "../utils/axiosSetup";
import { Product, User } from "../utils/tsInterface";
import Loader from "../utils/loader";
import { getDateJoined } from "../utils/getDateJoined";
import { showForm } from "../utils/showOrHideSignUpAndRegisterForms";

const ItemDisplay = () => {
  const theUserSelector = useSelector(userSelector);
  const user = theUserSelector.userData;

  const navigate = useNavigate();

  // Get the productID from the URL
  const { productID } = useParams();

  // This holds the product sent by the backend
  const [product, setProduct] = useState<Product>();

  // This holds the similar products sent by the backend, to be displayed on the 'Similar Products' section
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  // This holds the product owner, sent by the backend
  const [productOwner, setProductOwner] = useState<User>();

  // Set this to true by default, so that on page load, the Loader will show, while we are sending a request to get the product
  const [requestLoading, setRequestLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setRequestLoading(true);

        const response = await axiosClient.get(`/api/product/${productID}`);

        setProduct(response.data.product);
        setSimilarProducts(response.data.similarProducts);
        setProductOwner(response.data.productOwner);

        setRequestLoading(false);
      } catch {
        // If something went wrong, navigate the user to the 404 page
        navigate("/404");
      }
    };

    // Check if there is a productID, before running the code
    if (productID) {
      getProduct();
    }
  }, [navigate, productID]);

  // This holds the state, whether the currently logged in user has added this item to their bag
  const [inBag, setInBag] = useState(false);

  // This state controls when a user has sent a request to either add or remove an item from their bag
  const [bagRequestLoading, setBagRequestLoading] = useState(false);

  // This useEffect checks if the user is logged in. Then it confirms if this product is in the user's bag
  useEffect(() => {
    if (user && productID && user.bag?.includes(productID)) {
      setInBag(true);
    }
  }, [user, productID]);

  return (
    <>
      {requestLoading ? (
        <div className="min-h-screen grid place-items-center">
          <Loader />
        </div>
      ) : (
        <main className="min-h-screen">
          <div className="relative">
            <div className="min-[1120px]:grid grid-cols-[minmax(2fr,auto)_350px] grid-rows-1">
              <section className="p-4 min-[600px]:grid grid-cols-2 grid-rows-1 gap-3 min-[1120px]:block col-start-2 col-end-3 row-start-1 row-end-2 min-[1120px]:sticky z-10 top-5 max-w-[855px] mx-auto my-0 h-fit">
                <article className="mb-4 p-4 rounded-2xl bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                  <p className="text-center font-bold text-2xl break-all mb-2">
                    {/* NOTE: This is how we convert the code to HTML Entity. So, for e.g, the entity for naira is '&#8358;', however, what we stored in the backend is just the number, i.e '8358'. So, we we converted that code back to html entity (i.e &#8358;) */}
                    {String.fromCharCode(Number(product?.currency))}
                    {product?.amount}
                  </p>

                  <div className="my-4 flex justify-center">
                    <figure className="grid grid-cols-[auto_minmax(0,100%)] items-center">
                      <div className="relative">
                        <div className="rounded-full overflow-hidden mr-4 w-[40px] h-[40px]">
                          <img
                            alt={productOwner?.fullName}
                            src={
                              productOwner?.profilePicture
                                ? `${profilePictureURL}/${productOwner.profilePicture}`
                                : `/Profile_Image_Placeholder-small.jpg`
                            }
                          />
                        </div>
                      </div>

                      <figcaption className="font-bold text-left break-all">
                        <p>{productOwner?.fullName}</p>
                      </figcaption>
                    </figure>
                  </div>

                  <p className="text-center -mt-4 mb-4">
                    <small className="text-black block">
                      <MdWorkspacePremium className="inline" />
                      Joined Udohs: {getDateJoined(productOwner?.dateJoined)}
                      <MdWorkspacePremium className="inline" />
                    </small>
                  </p>

                  <Link
                    className="text-center block font-bold text-2xl"
                    to={`tel:${productOwner?.phoneNumber}`}
                  >
                    {productOwner?.phoneNumber}
                  </Link>

                  <Link
                    className="text-center block font-bold break-all"
                    to={`mailto:${productOwner?.email}`}
                  >
                    {" "}
                    {productOwner?.email}
                  </Link>

                  <div className="flex justify-center font-bold">
                    <button
                      type="button"
                      className="flex justify-center items-center gap-2 rounded-full ring-2 ring-white py-2 px-14 my-4 mt-6"
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
                    <li>
                      <strong>Never make payments in advance</strong>
                    </li>
                    <li>
                      <strong>
                        Arrange to meet in a secure, public location
                      </strong>
                    </li>
                    <li>
                      <strong>
                        Thoroughly examine the item before purchasing
                      </strong>
                    </li>
                    <li>
                      <strong>
                        Verify all documentation and only proceed with payment
                        if completely satisfied
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
                  {product?.photos.map((eachPhoto) => (
                    <picture
                      className="row-start-1 col-start-1"
                      key={eachPhoto}
                    >
                      <img
                        src={`${productImagesURL}/${eachPhoto}`}
                        alt="Photo"
                      />
                    </picture>
                  ))}
                </Carousel>

                <article className="p-4 self-start">
                  <p className="font-bold text-xl mb-4">{product?.title}</p>

                  <div>
                    <p className="flex items-center italic mb-4 gap-1">
                      {" "}
                      <IoLocationOutline />{" "}
                      <small>
                        {product?.state} {product?.country}
                      </small>
                    </p>
                  </div>

                  <div className="flex justify-between p-4 mb-3">
                    {!inBag ? (
                      <button
                        type="button"
                        disabled={bagRequestLoading}
                        className="text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 flex items-center gap-1 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed"
                        onClick={async () => {
                          // Check if the user is logged in, if not logged in, show the 'sign in' form
                          if (user && !bagRequestLoading) {
                            // Show the user the 'Remove from bag' button before even sending the request to add to bag
                            setInBag(true);

                            setBagRequestLoading(true);

                            // Send request to add the product to the bag.
                            const response = await axiosClient.put("/api/bag", {
                              productID,
                            });

                            // If there was an error and the product was not added to the bag, we want the 'Add to bag' button to show again
                            if (response.status !== 200) {
                              setInBag(false);
                            }

                            setBagRequestLoading(false);
                          } else if (!user) {
                            // If user is not logged in, show the 'sign in' form
                            showForm("#sign_IN_wrapper");
                          }
                        }}
                      >
                        <TbShoppingBagHeart className="text-2xl" />
                        <span>Add to bag</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={bagRequestLoading}
                        className="text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 flex items-center gap-1 px-4 py-3 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed"
                        onClick={async () => {
                          // Check if the user is logged in, if not logged in, show the 'Add to bag' button
                          if (user && !bagRequestLoading) {
                            // Show the user the 'Add to bag' button before even sending the request to remove from bag
                            setInBag(false);

                            setBagRequestLoading(true);

                            // Send request to remove the product to the bag.
                            const response = await axiosClient.delete(
                              `/api/bag/${productID}`
                            );

                            // If there was an error and the product was not removed from the bag, we want the 'Remove from bag' button to show again
                            if (response.status !== 200) {
                              setInBag(true);
                            }

                            setBagRequestLoading(false);
                          } else if (!user) {
                            // If user is not logged in,  show the 'Add to bag' button
                            setInBag(false);
                          }
                        }}
                      >
                        <TbShoppingBagX className="text-2xl" />
                        <span>Remove from bag</span>
                      </button>
                    )}
                  </div>

                  <p className="text-justify max-w-[600px]">
                    {product?.description}
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
              {similarProducts.map((product: Product) => {
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
                            {product.currency}
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
          </section>
        </main>
      )}
    </>
  );
};

export default ItemDisplay;
