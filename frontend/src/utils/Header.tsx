import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { hideForm, showForm } from "./showOrHideSignUpAndRegisterForms";
import Forgot_Password from "./forgotPassword";
import Sign_Up from "./sign_up";
import Sign_In from "./sign_in";
import { useEffect } from "react";
import axiosClient from "./axiosSetup";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../reduxFiles/selectors";
import { userAction } from "../reduxFiles/actions";

const Header = () => {
  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  // Use to check when a user navigates to a new page.
  // So, we want to fetch the user, anytime the user switched pages, to be sure the user is still logged in
  const navigate = useNavigate();

  // This useEffect fetches the user
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosClient.get("/api/getuser");
        if (response.status === 200) {
          dispatch(userAction({ userLoading: false, userData: response.data }));
        }
      } catch {
        /* User's jwt token was not available in cookie, or the user signed out */
        dispatch(userAction({ userLoading: false, userData: null }));
      }
    };

    getUser();
  }, [dispatch, navigate]);

  return (
    <header className="p-4">
      <nav>
        <ul className="flex justify-between items-center">
          <div className="flex flex-col gap-2 min-[550px]:flex-row">
            <li>
              <Link
                to="/items"
                className="uppercase ring-1 ring-white w-[80px] flex justify-center py-1 rounded-2xl font-bold tracking-[0.3em] hover:bg-[#ffa001] transition-colors ease-out duration-500  min-[650px]:text-xl min-[650px]:w-[110px]"
              >
                Buy
              </Link>
            </li>

            <li>
              <Link
                to="/sell"
                className="uppercase ring-1 ring-white w-[80px] flex justify-center py-1 rounded-2xl font-bold tracking-[0.3em] hover:bg-[#ffa001] transition-colors ease-out duration-500 min-[650px]:text-xl min-[650px]:w-[110px]"
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
            {user.userData ? (
              <li className="relative">
                <button type="button" className="peer">
                  <FaUserPlus className="text-5xl text-green-700" />
                </button>

                <ul className="absolute bg-white text-black w-[100px] top-[45px] right-0 p-2 z-20 text-sm font-bold rounded-xl opacity-0 peer-focus-within:opacity-100 focus-within:opacity-100 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
                  <li>
                    <Link
                      to="/user"
                      onClick={() => {
                        // NOTE: We did it like this to avoid errors because there are some elements (like svg) that do not have ".blur()"
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                      className="block w-full text-left pb-3 border-b-2"
                    >
                      My account
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={async () => {
                        // NOTE: We did it like this to avoid errors because there are some elements (like svg) that do not have ".blur()"
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }

                        try {
                          const response = await axiosClient.post(
                            "/api/logout"
                          );
                          if (response.status === 200) {
                            dispatch(
                              userAction({ userLoading: false, userData: null })
                            );

                            navigate("/");
                          }
                        } catch {
                          //
                        }
                      }}
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
                  <button
                    type="button"
                    className="uppercase ring-2 ring-[#a1d06d] w-[80px] flex justify-center py-1 rounded-2xl font-bold text-sm hover:scale-110 transition-colors ease-linear duration-500 min-[650px]:text-xl min-[650px]:w-[110px]"
                    onClick={() => showForm("#sign_IN_wrapper")}
                  >
                    Sign in
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="uppercase ring-1 ring-white bg-[#a1d06d] w-[80px] flex justify-center py-1 rounded-2xl font-bold text-sm scale-100 hover:scale-110 transition-colors ease-linear duration-500  min-[650px]:text-xl min-[650px]:w-[110px]"
                    onClick={() => showForm("#sign_UP_wrapper")}
                  >
                    Register
                  </button>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>

      <section
        id="sign_IN_wrapper"
        className="bg-[rgba(0,0,0,.7)] fixed z-50 top-[1200px] left-0 w-full h-full hidden transition-all duration-500 ease-in-out"
        onClick={() => hideForm("#sign_IN_wrapper")}
      >
        <Sign_In
          hideSignInForm={() => hideForm("#sign_IN_wrapper")}
          showSignUpForm={() => {
            showForm("#sign_UP_wrapper");
          }}
          showSForgotPasswordForm={() => showForm("#forgotPassword_wrapper")}
        />
      </section>

      <section
        id="sign_UP_wrapper"
        className="bg-[rgba(0,0,0,.7)] fixed z-50 top-[1200px] left-0 w-full h-full hidden transition-all duration-500 ease-in-out"
        onClick={() => hideForm("#sign_UP_wrapper")}
      >
        <Sign_Up
          hideSignUpForm={() => {
            hideForm("#sign_UP_wrapper");
          }}
          showSignInForm={() => {
            showForm("#sign_IN_wrapper");
          }}
        />
      </section>

      <section
        id="forgotPassword_wrapper"
        className="bg-[rgba(0,0,0,.7)] fixed z-50 top-[1200px] top- left-0 w-full h-full hidden transition-all duration-500 ease-in-out"
        onClick={() => hideForm("#forgotPassword_wrapper")}
      >
        <Forgot_Password
          hideForgotPasswordForm={() => {
            hideForm("#forgotPassword_wrapper");
          }}
          showSignUpForm={() => {
            showForm("#sign_UP_wrapper");
          }}
          showSignInForm={() => {
            showForm("#sign_IN_wrapper");
          }}
        />
      </section>
    </header>
  );
};

export default Header;
