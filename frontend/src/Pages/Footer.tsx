import { Link } from "react-router-dom";

const Footer = () => {
  const date = new Date();

  return (
    <footer
      id="pageFooter"
      className="p-4 h-[200px] text-xl flex flex-col items-center justify-center gap-8 font-bold text-white drop-shadow-[0px_1px_black]"
    >
      <Link
        to=""
        className="block hover:underline decoration-blue-500
      "
      >
        About us
      </Link>
      <p>&copy;{date.getFullYear()} udohs</p>
    </footer>
  );
};

export default Footer;
