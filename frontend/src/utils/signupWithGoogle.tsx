// URL to documentation - https://docs.amplify.aws/lib/auth/social/q/platform/js/

import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosSetup";
import { SignUpWithGoogleProps } from "./tsInterface";

const SignUpWithGoogle: React.FC<SignUpWithGoogleProps> = () => {
  const [googleLink, setGoogleLink] = useState("");

  // This gets the Link that the user will be redirected to, when they click 'Sign in with Google'
  useEffect(() => {
    const getGoogleLink = async () => {
      try {
        const response = await axiosClient.get("/api/getgooglelink");
        if (response.status === 200) {
          setGoogleLink(response.data.auth_url);
        }
      } catch {
        setGoogleLink("");
      }
    };

    getGoogleLink();
  }, []);

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* NOTE: Here, I had issues of the the 'after' and 'before' causing an overflow. I fixed it by setting 'after:flex-[0_0_800px]' and 'before:flex-[0_0_800px]' */}
      <p className="flex justify-center items-center uppercase font-bold my-6 before:mr-2 before:h-[1px] before:flex-[0_0_800px] before:bg-white after:h-[1px] after:flex-[0_0_800px] after:bg-white after:ml-2">
        or
      </p>

      <button
        disabled={!googleLink}
        onClick={() => {
          window.location.href = googleLink;
          // resetPasswordFields();
        }}
        className="flex justify-center items-center w-[90%] max-w-[280px] h-[52px] border-white border-[3px] hover:bg-gray-200 hover:text-black font-medium  rounded-3xl disabled:text-red-500 disabled:cursor-not-allowed"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-[20px] h-[20px] mr-2"
        >
          <g>
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </g>
        </svg>
        <span className="font-bold">Continue with google</span>
      </button>
    </div>
  );
};

export default SignUpWithGoogle;
