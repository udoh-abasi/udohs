import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

const Header = () => {
  const user = true;

  return (
    <header className="p-4">
      <nav>
        <ul className="flex justify-between items-center">
          <div className="flex flex-col gap-2 min-[550px]:flex-row">
            <li>
              <Link
                to=""
                className="uppercase ring-1 ring-white w-[80px] flex justify-center py-1 rounded-2xl font-bold tracking-widest hover:bg-[#ffa001] transition-colors ease-out duration-500  min-[650px]:text-xl min-[650px]:w-[110px]"
              >
                Buy
              </Link>
            </li>

            <li>
              <Link
                to=""
                className="uppercase ring-1 ring-white w-[80px] flex justify-center py-1 rounded-2xl font-bold tracking-widest hover:bg-[#ffa001] transition-colors ease-out duration-500 min-[650px]:text-xl min-[650px]:w-[110px]"
              >
                Sell
              </Link>
            </li>
          </div>

          <li>
            <Link
              to="/"
              title="home"
              className="font-bold tracking-[-0.12em] text-4xl  min-[650px]:text-5xl"
              id="logo"
            >
              udohs
            </Link>
          </li>

          <div className="flex flex-col gap-4 min-[550px]:flex-row">
            {user ? (
              <li className="relative">
                <button type="button" className="peer">
                  <FaUserPlus className="text-5xl text-green-700" />
                </button>

                <ul className="absolute bg-white text-black w-[100px] top-[45px] right-0 p-2 z-10 text-sm font-bold rounded-xl opacity-0 peer-focus-within:opacity-100 focus-within:opacity-100 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                  <li>
                    <button
                      type="button"
                      className="block w-full text-left pb-3 border-b-2"
                    >
                      My account
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="block w-full text-left pt-2"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to=""
                    className="uppercase ring-2 ring-[#a1d06d] w-[80px] flex justify-center py-1 rounded-2xl font-bold text-sm hover:scale-110 transition-colors ease-linear duration-500 min-[650px]:text-xl min-[650px]:w-[110px]"
                  >
                    Sign in
                  </Link>
                </li>

                <li>
                  <Link
                    to=""
                    className="uppercase ring-1 ring-white bg-[#a1d06d] w-[80px] flex justify-center py-1 rounded-2xl font-bold text-sm scale-100 hover:scale-110 transition-colors ease-linear duration-500  min-[650px]:text-xl min-[650px]:w-[110px]"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
