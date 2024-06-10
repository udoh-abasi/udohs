import { Link } from "react-router-dom";

const Header = () => {
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
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
