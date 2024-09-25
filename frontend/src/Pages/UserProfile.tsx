import { MdWorkspacePremium } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { FaBagShopping } from "react-icons/fa6";
import EditProfile from "../utils/editProfile";
import { hideForm, showForm } from "../utils/showOrHideSignUpAndRegisterForms";
import Loader from "../utils/loader";
import { userSelector } from "../reduxFiles/selectors";
import { useSelector } from "react-redux";
import axiosClient, {
  productImagesURL,
  profilePictureURL,
} from "../utils/axiosSetup";
import { getDateJoined } from "../utils/getDateJoined";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../utils/tsInterface";

const UserProfile = () => {
  const theUserSelector = useSelector(userSelector);
  const user = theUserSelector.userData;

  const navigate = useNavigate();

  // This will be used to set the data of useQuery (using queryClient.setQueryData). Similar to 'setData', when using 'useState'
  const queryClient = useQueryClient();

  // If the user visited the link 'http://localhost:5173/user', this will be true, but if they navigated from another page (like, while on the home page, they clicked 'Profile'), then this will be false
  const userIsLoading = theUserSelector.userLoading;

  const { data, isLoading } = useQuery({
    queryKey: ["userAdverts"],
    queryFn: async () => {
      return (await axiosClient.get("/api/useradverts")).data;
    },
  });

  return (
    <>
      {userIsLoading ? (
        <div className="min-h-screen grid place-items-center">
          <Loader />
        </div>
      ) : (
        <main className="min-h-screen">
          <div className="min-[600px]:grid grid-rows-1 grid-cols-[350px,auto] relative mt-16">
            <section className="min-[450px]:p-4 min-[600px]:pt-0 row-start-1 row-end-1 col-start-1 col-end-1 h-fit static min-[600px]:sticky top-10">
              <article className="mb-4 p-4 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                <div className="my-4 flex justify-center">
                  <figure>
                    <div className="relative">
                      <div className="rounded-full overflow-hidden mx-auto w-[120px] h-[120px] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                        <img
                          alt={user?.fullName}
                          src={
                            user?.profilePicture
                              ? `${profilePictureURL}/${user.profilePicture}`
                              : `/Profile_Image_Placeholder-small.jpg`
                          }
                        />
                      </div>
                    </div>

                    <figcaption className="font-bold text-center break-all text-2xl">
                      <p>{user?.fullName}</p>
                    </figcaption>
                  </figure>
                </div>

                <p className="text-center -mt-4 mb-4">
                  <small className="text-black block">
                    <MdWorkspacePremium className="inline" />
                    Joined Udohs: {getDateJoined(user?.dateJoined)}
                    <MdWorkspacePremium className="inline" />
                  </small>
                </p>

                <Link
                  className="text-center block font-bold text-2xl"
                  to={`tel:${user?.phoneNumber}`}
                >
                  {user?.phoneNumber}
                </Link>

                <Link
                  className="text-center block font-bold break-all"
                  to={`mailto:${user?.email}`}
                >
                  {user?.email}
                </Link>

                <div className="flex justify-center font-bold">
                  <button
                    type="button"
                    onClick={() => showForm("#editProfile")}
                    className="flex justify-center items-center gap-2 rounded-full ring-2 ring-blue-500 text-blue-500 uppercase py-2 px-16 my-4 mt-6"
                  >
                    <FaEdit className="text-2xl" /> <span>Edit</span>
                  </button>
                </div>
              </article>

              <div className="flex justify-center flex-col font-bold mb-4 p-4 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                <button
                  type="button"
                  className="flex justify-center items-center gap-2 rounded-full ring-2 ring-white py-2 px-16 my-4 mt-6"
                >
                  {" "}
                  <IoChatboxOutline className="text-2xl" />{" "}
                  <span>View Chats</span>
                </button>

                <button
                  type="button"
                  className="flex justify-center items-center gap-2 rounded-full ring-2 ring-white py-2 px-16 my-4 mt-6"
                  onClick={() => {
                    navigate("/bag");
                  }}
                >
                  {" "}
                  <FaBagShopping className="text-2xl" /> <span>View Bag</span>
                </button>
              </div>
            </section>

            <section className="my-16 min-[600px]:my-0 row-start-1 row-end-1 col-start-2 col-end-3">
              <h2 className="Anton text-center text-4xl max-[420px]:text-2xl px-4 font-bold uppercase mb-8 tracking-[0.2em]">
                Adverts
              </h2>

              {isLoading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : (
                <></>
              )}

              {data && data.length ? (
                <ul className="p-4 pt-0 min-[460px]:grid grid-cols-1 max-[599.9px]:grid-cols-2 min-[810px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-[16px] justify-items-center">
                  {data.map((product: Product) => {
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

                        <div className="flex justify-between p-4 border-t-2 border-white">
                          <button
                            type="button"
                            className="block text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="block text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 px-3 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                            onClick={async () => {
                              // First, we want to quickly remove the deleted data from the frontend
                              const newData = data.filter(
                                (eachProduct: Product) =>
                                  eachProduct._id !== product._id
                              );

                              // NOTE: This sets the useQuery's data to our new data
                              queryClient.setQueryData(
                                ["userAdverts"],
                                newData
                              );

                              // Then we send a request to the backend to delete the data
                              try {
                                await axiosClient.delete(
                                  `/api/product/${product._id}`
                                );
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
                  })}
                </ul>
              ) : (
                <p className="text-center font-bold italic text-black">
                  You have NOT added an advert yet.
                </p>
              )}
            </section>
          </div>

          <section
            id="editProfile"
            className="bg-[rgba(0,0,0,.7)] fixed z-50 top-[1200px] left-0 w-full h-full hidden transition-all duration-500 ease-in-out"
            onClick={() => hideForm("#editProfile")}
          >
            <EditProfile />
          </section>
        </main>
      )}
    </>
  );
};

export default UserProfile;
