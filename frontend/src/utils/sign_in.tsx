import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible, AiFillWarning } from "react-icons/ai";
import { FaRegWindowClose } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { signInProps } from "../utils/tsInterface";
import Loader from "./loader";
import axiosClient from "./axiosSetup";

const Sign_In: React.FC<signInProps> = ({
  hideSignInForm,
  showSignUpForm,
  showSForgotPasswordForm,
}) => {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [signInError, setSignInError] = useState("");

  const [signInLoading, setSignInLoading] = useState(false);

  const signIn = async () => {
    try {
      setSignInError("");
      setSignInLoading(true);
      const response = await axiosClient.post("/api/signin", {
        email: signInEmail,
        password: signInPassword,
      });

      console.log(response.data);

      // if (response.status === 200) {
      //   const response = await axiosClient.get("/api/user");
      //   if (response.status === 200) {
      //     // dispatch(userAction({ userLoading: false, userData: response.data }));
      //   }

      //   hideSignInForm();
      //   setSignInEmail("");
      //   setSignInPassword("");
      // } else {
      //   throw new Error("Something went wrong");
      // }

      setSignInEmail("");
      setSignInPassword("");
      setSignInLoading(false);
    } catch (e) {
      setSignInLoading(false);
      if (
        // NOTE: If we do not do this 'narrowing of type', we will get an error that 'e is unknown'
        typeof e === "object" &&
        e &&
        "request" in e &&
        typeof e.request == "object" &&
        e.request &&
        "status" in e.request &&
        typeof e.request.status === "number"
      ) {
        switch (e.request.status) {
          case 401: {
            setSignInError("User not found. Email or password is incorrect");
            return;
          }

          case 404: {
            setSignInError("User not found. Email or password is incorrect");
            return;
          }

          default: {
            setSignInError(
              "Something went wrong with your sign in. Please try again"
            );
            return;
          }
        }
      }
    }
  };

  return (
    <div className="grid place-items-center h-screen overflow-auto">
      <section
        className="relative p-4 bg-[#c9a998] h-fit w-full rounded-xl max-w-[615px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-3xl text-white font-bold mt-6">
          Welcome back.
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!signInLoading) {
              signIn();
            }
          }}
          className="mt-8"
        >
          <div className="flex flex-col-reverse mb-8 relative mt-16 text-black">
            <input
              type="email"
              required
              placeholder=" "
              id="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
            />

            <label
              htmlFor="email"
              className="cursor-text font-bold text-lg p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-90%] peer-focus:translate-y-[0] top-[-90%] transition-all duration-500 ease-linear"
            >
              Email&nbsp;<span className="text-red-500">&#42;</span>
            </label>
          </div>

          <div className="flex flex-col-reverse relative mt-20 text-black">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder=" "
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)]"
            />

            <button
              type="button"
              className="absolute top-1 right-0 cursor-pointer text-3xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>

            <label
              htmlFor="password"
              className="cursor-text font-bold text-lg p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:top-[-90%] peer-focus:text-black peer-focus:translate-y-[0] top-[-90%] transition-all duration-500 ease-linear"
            >
              Password&nbsp;<span className="text-red-500">&#42;</span>
            </label>
          </div>

          <div className="mb-12 text-right mt-3 text-lg text-black font-bold">
            <button
              type="button"
              className="underline decoration-blue-600 italic"
              onClick={() => {
                hideSignInForm();
                showSForgotPasswordForm();
              }}
            >
              Forgot your password&#x3f;
            </button>
          </div>

          <button
            type="submit"
            disabled={signInLoading}
            className="w-full font-bold uppercase relative flex items-center justify-center px-6 py-3 text-lg tracking-tighter text-white bg-gray-800 rounded-md group disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-black rounded-md group-hover:mt-0 group-hover:ml-0"></span>
            <span className="absolute inset-0 w-full h-full bg-[#81ba40] rounded-md "></span>
            <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-black rounded-md opacity-0 group-hover:opacity-100 "></span>
            <span className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-white flex items-center">
              <>
                {signInLoading ? (
                  <Loader />
                ) : (
                  <>
                    Sign in <HiOutlineLogin className="ml-2" />
                  </>
                )}
              </>
            </span>
          </button>

          {signInError && (
            <p className="text-red-500 text-sm text-center mt-4">
              <AiFillWarning className="inline text-lg mr-1" />
              {signInError}
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-black text-lg">
          <button
            className="underline decoration-blue-600 italic"
            type="button"
            onClick={() => {
              hideSignInForm();
              showSignUpForm();
            }}
          >
            Don&apos;t have an account&#x3f;{" "}
            <span className="font-bold">Register</span>
          </button>
        </div>

        <button
          type="button"
          className="text-4xl absolute top-2 right-3 text-black"
          onClick={hideSignInForm}
        >
          <FaRegWindowClose />
        </button>
      </section>
    </div>
  );
};

export default Sign_In;
