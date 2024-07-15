import { MdWorkspacePremium } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { FaBagShopping } from "react-icons/fa6";

const UserProfile = () => {
  return (
    <main className="min-h-screen">
      <div className="min-[600px]:grid grid-rows-1 grid-cols-[350px,auto] relative mt-16">
        <section className="min-[450px]:p-4 min-[600px]:pt-0 row-start-1 row-end-1 col-start-1 col-end-1 h-fit static min-[600px]:sticky top-10">
          <article className="mb-4 p-4 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
            <div className="my-4 flex justify-center">
              <figure>
                <div className="relative">
                  <div className="rounded-full overflow-hidden mx-auto w-[120px] h-[120px]">
                    <img
                      alt={``}
                      src={`/Profile_Image_Placeholder-small.jpg`}
                    />
                  </div>
                </div>

                <figcaption className="font-bold text-center break-all text-2xl">
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
                className="flex justify-center items-center gap-2 rounded-full ring-2 ring-blue-500 text-blue-500 uppercase py-2 px-16 my-4 mt-6"
              >
                {" "}
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
              <IoChatboxOutline className="text-2xl" /> <span>View Chats</span>
            </button>

            <button
              type="button"
              className="flex justify-center items-center gap-2 rounded-full ring-2 ring-white py-2 px-16 my-4 mt-6"
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

          <ul className="p-4 pt-0 min-[460px]:grid grid-cols-1 max-[599.9px]:grid-cols-2 min-[810px]:grid-cols-2 min-[1150px]:grid-cols-3 gap-[16px] justify-items-center">
            <li className="max-[460px]:mb-8 rounded-2xl hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <Link to="" className="block px-2 py-5 relative">
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
                      Rolls Royce
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>

              <div className="flex justify-between p-4">
                <button
                  type="button"
                  className="block text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="block text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 px-3 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Delete
                </button>
              </div>
            </li>

            <li className="max-[460px]:mb-8 rounded-2xl hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <Link to="" className="block px-2 py-5 relative">
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
                      Rolls Royce
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>

              <div className="flex justify-between p-4">
                <button
                  type="button"
                  className="block text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="block text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 px-3 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Delete
                </button>
              </div>
            </li>

            <li className="max-[460px]:mb-8 rounded-2xl hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <Link to="" className="block px-2 py-5 relative">
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
                      Rolls Royce
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>

              <div className="flex justify-between p-4">
                <button
                  type="button"
                  className="block text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="block text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 px-3 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Delete
                </button>
              </div>
            </li>

            <li className="max-[460px]:mb-8 rounded-2xl hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <Link to="" className="block px-2 py-5 relative">
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
                      Rolls Royce
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>

              <div className="flex justify-between p-4">
                <button
                  type="button"
                  className="block text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="block text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 px-3 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Delete
                </button>
              </div>
            </li>

            <li className="max-[460px]:mb-8 rounded-2xl hover:bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
              <Link to="" className="block px-2 py-5 relative">
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
                      Rolls Royce
                    </p>

                    <p className="absolute top-0 text-sm font-bold">
                      <em>Abuja, Nigeria</em>
                    </p>
                  </figcaption>
                </figure>
              </Link>

              <div className="flex justify-between p-4">
                <button
                  type="button"
                  className="block text-lg rounded-lg hover:ring-2 ring-blue-500 text-blue-500 px-4 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="block text-sm rounded-lg hover:ring-2 ring-red-500 text-red-500 px-3 py-1 font-bold bg-[#d1b5a6] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default UserProfile;
