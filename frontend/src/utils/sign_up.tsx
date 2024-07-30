import React, { useEffect, useState } from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillWarning,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import Loader from "../utils/loader";
import axiosClient from "../utils/axiosSetup";
import { BsArrowRight } from "react-icons/bs";
import { TbMessage2Down } from "react-icons/tb";
import { IoIosCheckmark, IoIosCheckmarkCircle } from "react-icons/io";
import { HiOutlineLogin } from "react-icons/hi";
import { FaRegWindowClose } from "react-icons/fa";
import { signUpProps } from "../utils/tsInterface";
import { userAction } from "../reduxFiles/actions";
import { useDispatch } from "react-redux";

const Sign_Up: React.FC<signUpProps> = ({ hideSignUpForm, showSignInForm }) => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm_password, setShowConfirm_password] = useState(false);

  const [signUpEmail, setSignUpEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showEmailField, setShowEmailField] = useState(true);
  const [emailSendingError, setEmailSendingError] = useState("");

  const [requestIsLoading, setRequestIsLoading] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [emailConfirmationCode, setEmailConfirmationCode] = useState("");

  // Test if the email is valid
  const isEmailValid = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Show message that password must match
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Show the <ul> that tell the user what to be in the password field
  const [showPasswordHelper, setShowPasswordHelper] = useState(false);

  const [passwordHasUppercase, setPasswordHasUppercase] = useState(false);
  const [passwordHasLowercase, setPasswordHasLowercase] = useState(false);
  const [passwordHasNumber, setPasswordHasNumber] = useState(false);
  const [passwordHasCharacter, setPasswordHasCharacter] = useState(false);
  const [passwordIsEightDigit, setPasswordIsEightDigit] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // If there was an error when the signUp button was clicked, the message will be set here
  const [signUpError, setSignUpError] = useState("");

  // This function manages the regular expression, and show what the user has ticked and what they have not
  const passwordRegularExpressionCheck = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(e.target.value);

    if (/(?=.*[a-z])/.test(e.target.value)) {
      setPasswordHasLowercase(true);
    } else {
      setPasswordHasLowercase(false);
    }

    if (/(?=.*[A-Z])/.test(e.target.value)) {
      setPasswordHasUppercase(true);
    } else {
      setPasswordHasUppercase(false);
    }

    if (/(?=.*\d)/.test(e.target.value)) {
      setPasswordHasNumber(true);
    } else {
      setPasswordHasNumber(false);
    }

    if (/(?=.*[^\da-zA-Z])/.test(e.target.value)) {
      setPasswordHasCharacter(true);
    } else {
      setPasswordHasCharacter(false);
    }

    if (/^.{8,100}$/.test(e.target.value)) {
      setPasswordIsEightDigit(true);
    } else {
      setPasswordIsEightDigit(false);
    }
  };

  // This useEffect checks if the password and the confirmPassword is the same
  // But it will only set the passwordMatch to false if we have typed something into the confirmPassword field
  useEffect(() => {
    if (confirmPassword !== password && confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [confirmPassword, password]);

  // This sends an email code to verify the user's email before sign up. Returns a 403 error if the email already exists
  const sendEmail = async (emailAddress: string) => {
    try {
      if (emailAddress.trim()) {
        setRequestIsLoading(true);
        setEmailSendingError("");

        const response = await axiosClient.post("/api/sendsignupmail", {
          email: emailAddress,
        });

        if (response.status === 200) {
          setShowEmailField(false);
        }
        setRequestIsLoading(false);
      }
    } catch (e) {
      setRequestIsLoading(false);
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
          case 403: {
            setEmailSendingError(
              "User already exists. Sign in or choose another email"
            );
            return;
          }
          default: {
            setEmailSendingError(
              "Something went wrong. Please try again later"
            );
            return;
          }
        }
      }
    }
  };

  const confirmEmailCode = async (code: string) => {
    setRequestIsLoading(true);

    try {
      if (signUpEmail.trim() && code.trim()) {
        const response = await axiosClient.post("api/confirmemail", {
          email: signUpEmail,
          code: code,
        });
        if (response.status === 200) {
          setEmailVerified(true);
        }
        setRequestIsLoading(false);
      }
    } catch {
      setIncorrectCode(true);
      setRequestIsLoading(false);
    }
  };

  const registerUser = async (email: string, password: string) => {
    if (
      passwordHasCharacter &&
      passwordHasUppercase &&
      passwordHasLowercase &&
      passwordHasNumber &&
      passwordIsEightDigit &&
      passwordMatch &&
      signUpEmail.trim() &&
      fullName.trim() &&
      phoneNumber.trim() &&
      emailConfirmationCode.trim()
    ) {
      setRequestIsLoading(true);
      setSignUpError("");

      try {
        const response = await axiosClient.post("/api/signup", {
          email,
          password,
          fullName,
          phoneNumber,
          emailConfirmationCode,
        });

        if (response.status === 200) {
          dispatch(userAction({ userLoading: false, userData: response.data }));

          // Then reset everything back to default
          setSignUpEmail("");
          setPassword("");
          setConfirmPassword("");
          setFullName("");
          setPhoneNumber("");
          setEmailConfirmationCode("");
          setSignUpError("");

          setEmailVerified(false);
          setShowEmailField(true);

          setPasswordHasCharacter(false);
          setPasswordHasLowercase(false);
          setPasswordHasNumber(false);
          setPasswordHasUppercase(false);
          setPasswordIsEightDigit(false);

          setRequestIsLoading(false);
          hideSignUpForm();
        } else {
          throw new Error("Something went wrong");
        }
      } catch (e) {
        setRequestIsLoading(false);
        setSignUpError("Something went wrong with your registration.");
      }
    }
  };

  return (
    <div className="grid place-items-center h-screen overflow-auto">
      <div
        className="relative p-4 bg-[#c9a998] h-fit w-full rounded-xl max-w-[615px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <section className="">
          <h2 className="text-center text-3xl text-white font-bold mt-6">
            Join Udohs.
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="mt-8">
            {!emailVerified && (
              <div className="flex flex-col-reverse mb-8 relative mt-16 text-black">
                <input
                  type="email"
                  required
                  placeholder=" "
                  id="signUpEmail"
                  disabled={!showEmailField}
                  value={signUpEmail}
                  onChange={(e) => {
                    setSignUpEmail(e.target.value);
                    setInvalidEmail(false);
                    setEmailSendingError("");
                  }}
                  className="the h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:!bg-gray-600 disabled:!ring-gray-600 disabled:!text-gray-400"
                />

                <label
                  htmlFor="signUpEmail"
                  className="the cursor-text font-bold text-lg p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-90%] peer-focus:translate-y-[0] top-[-90%] transition-all duration-500 ease-linear"
                >
                  Email&nbsp;<span className="text-red-500">&#42;</span>
                </label>
              </div>
            )}

            {invalidEmail && (
              <p className="flex items-center text-sm text-red-500 mb-4 mt-[-12px]">
                <AiFillWarning className="text-2xl" />
                Please enter a valid email
              </p>
            )}

            {emailSendingError && (
              <p className="flex items-center text-sm text-red-500 mb-4 mt-[-12px]">
                <AiFillWarning className="text-2xl" />
                {emailSendingError}
              </p>
            )}

            {!emailVerified && showEmailField ? (
              <button
                type="submit"
                disabled={requestIsLoading}
                onClick={() => {
                  if (isEmailValid(signUpEmail) && !requestIsLoading) {
                    sendEmail(signUpEmail);
                  } else {
                    setInvalidEmail(true);
                  }
                }}
                className="w-full max-w-[250px] font-bold relative flex items-center justify-center px-6 py-3 text-lg tracking-tighter text-white bg-gray-800 rounded-md group disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-black rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                <span className="absolute inset-0 w-full h-full bg-[#81ba40] rounded-md "></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-black rounded-md opacity-0 group-hover:opacity-100 "></span>
                <span className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-white flex items-center">
                  {requestIsLoading ? (
                    <Loader />
                  ) : (
                    <>
                      Continue <BsArrowRight className="ml-2" />
                    </>
                  )}
                </span>
              </button>
            ) : (
              !emailVerified && (
                <>
                  <div className="flex flex-col gap-8 min-[500px]:flex-row">
                    <button
                      type="button"
                      disabled={false}
                      onClick={() => {
                        setShowEmailField(true);
                        setEmailConfirmationCode("");
                        setIncorrectCode(false);
                      }}
                      className="w-full max-w-[250px] font-bold relative flex items-center justify-center px-6 py-3 text-lg tracking-tighter text-white bg-gray-800 rounded-md group"
                    >
                      <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-white rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                      <span className="absolute inset-0 w-full h-full bg-[#70dbb8] rounded-md "></span>
                      <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-white rounded-md opacity-0 group-hover:opacity-100 "></span>
                      <span className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-black flex items-center">
                        Change Email
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={false}
                      onClick={() => {
                        setShowEmailField(true);
                        setEmailConfirmationCode("");
                        setIncorrectCode(false);
                      }}
                      className="w-full max-w-[250px] font-bold relative flex items-center justify-center px-6 py-3 text-lg tracking-tighter text-white bg-gray-800 rounded-md group"
                    >
                      <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-white rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                      <span className="absolute inset-0 w-full h-full bg-[#70dbb8] rounded-md "></span>
                      <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-white rounded-md opacity-0 group-hover:opacity-100 "></span>
                      <span className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-black flex items-center">
                        <>Resend Code</>
                      </span>
                    </button>
                  </div>

                  <p className="mt-6 text-black font-bold flex flex-col items-center">
                    <TbMessage2Down className="text-3xl" />{" "}
                    <span className="text-center">
                      {" "}
                      A confirmation code has been sent to{" "}
                      <strong> {signUpEmail}. </strong>
                      Please enter the code to confirm this is your email.
                    </span>
                  </p>

                  <div className="flex flex-col-reverse mb-4 relative mt-10 text-black">
                    <input
                      type="number"
                      maxLength={6}
                      required
                      placeholder=" "
                      id="signUpCode"
                      value={emailConfirmationCode}
                      onChange={(e) => {
                        setEmailConfirmationCode(e.target.value);
                        setIncorrectCode(false);
                      }}
                      className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
                    />

                    <label
                      htmlFor="signUpCode"
                      className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-70%] peer-focus:translate-y-[0] top-[-70%] transition-all duration-500 ease-linear"
                    >
                      Confirmation code&nbsp;
                      <span className="text-red-500">&#42;</span>
                    </label>
                  </div>

                  {incorrectCode && (
                    <p className="flex items-center text-sm text-red-600 mb-4">
                      <AiFillWarning className="text-2xl" />
                      Email verification failed. Please check the code and try
                      again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={requestIsLoading}
                    onClick={() => {
                      setIncorrectCode(false);
                      if (
                        emailConfirmationCode.length === 6 &&
                        !requestIsLoading
                      ) {
                        confirmEmailCode(emailConfirmationCode);
                      } else {
                        setIncorrectCode(true);
                      }
                    }}
                    className="w-full max-w-[250px] font-bold relative flex items-center justify-center px-6 py-3 text-lg tracking-tighter text-white bg-gray-800 rounded-md group"
                  >
                    <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-white rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                    <span className="absolute inset-0 w-full h-full bg-[#70dbb8] rounded-md "></span>
                    <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-white rounded-md opacity-0 group-hover:opacity-100 "></span>
                    <span className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-black flex items-center">
                      {requestIsLoading ? (
                        <Loader />
                      ) : (
                        <>
                          Confirm Code <BsArrowRight className="ml-2" />
                        </>
                      )}
                    </span>
                  </button>
                </>
              )
            )}

            {emailVerified && (
              <>
                <p className="flex items-center text-2xl justify-center text-black font-bold mt-8  max-[450px]:text-xl">
                  Email verified successfully{" "}
                  <IoIosCheckmarkCircle className="ml-2 text-3xl max-[320px]:ml-0 max-[340px]:text-xl text-green-700" />
                </p>

                <div className="flex flex-col-reverse mb-4 relative mt-8 text-black">
                  <input
                    id="signUpPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder=" "
                    value={password}
                    onFocus={() => setShowPasswordHelper(true)}
                    onBlur={() => setShowPasswordHelper(false)}
                    onChange={(e) => passwordRegularExpressionCheck(e)}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$"
                    className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
                  />

                  <button
                    type="button"
                    className="absolute top-1 right-0 cursor-pointer text-3xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>

                  <label
                    htmlFor="signUpPassword"
                    className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-60%] peer-focus:translate-y-[0] top-[-60%] transition-all duration-500 ease-linear"
                  >
                    Password&nbsp;<span className="text-red-500">&#42;</span>
                  </label>
                </div>

                {showPasswordHelper && (
                  <ul className="pl-8 text-red-600 font-bold py-2 text-sm">
                    <li
                      className={`${
                        passwordHasUppercase && "text-green-700"
                      } flex items-center`}
                    >
                      <span className="mr-2">
                        At least one uppercase letter
                      </span>

                      <span>
                        {passwordHasUppercase ? (
                          <IoIosCheckmark className="text-2xl" />
                        ) : (
                          <AiOutlineCloseCircle />
                        )}
                      </span>
                    </li>

                    <li
                      className={`${
                        passwordHasLowercase && "text-green-700"
                      } flex items-center`}
                    >
                      <span className="mr-3">
                        At least one lowercase letter
                      </span>

                      <span>
                        {passwordHasLowercase ? (
                          <IoIosCheckmark className="text-2xl" />
                        ) : (
                          <AiOutlineCloseCircle />
                        )}
                      </span>
                    </li>

                    <li
                      className={`${
                        passwordHasNumber && "text-green-700"
                      } flex items-center`}
                    >
                      <span className="mr-20">At least one digit</span>

                      <span>
                        {passwordHasNumber ? (
                          <IoIosCheckmark className="text-2xl" />
                        ) : (
                          <AiOutlineCloseCircle />
                        )}
                      </span>
                    </li>

                    <li
                      className={`${
                        passwordHasCharacter && "text-green-700"
                      } flex items-center`}
                    >
                      <span className="mr-2">
                        At least one special character
                      </span>

                      <span>
                        {passwordHasCharacter ? (
                          <IoIosCheckmark className="text-2xl" />
                        ) : (
                          <AiOutlineCloseCircle />
                        )}
                      </span>
                    </li>

                    <li
                      className={`${
                        passwordIsEightDigit && "text-green-700"
                      } flex items-center`}
                    >
                      <span className="mr-8">At least 8 characters long</span>

                      <span>
                        {passwordIsEightDigit ? (
                          <IoIosCheckmark className="text-2xl" />
                        ) : (
                          <AiOutlineCloseCircle />
                        )}
                      </span>
                    </li>
                  </ul>
                )}

                <div className="flex flex-col-reverse relative mt-16 mb-8 text-black">
                  <input
                    id="confirm_password"
                    type={showConfirm_password ? "text" : "password"}
                    required
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$"
                  />

                  <button
                    type="button"
                    className="absolute top-1 right-0 cursor-pointer text-3xl"
                    onClick={() =>
                      setShowConfirm_password(!showConfirm_password)
                    }
                  >
                    {showConfirm_password ? (
                      <AiFillEyeInvisible />
                    ) : (
                      <AiFillEye />
                    )}
                  </button>

                  <label
                    htmlFor="confirm_password"
                    className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-60%] peer-focus:translate-y-[0] top-[-60%] transition-all duration-500 ease-linear"
                  >
                    Confirm Password&nbsp;
                    <span className="text-red-500">&#42;</span>
                  </label>
                </div>

                {!passwordMatch && (
                  <p className="flex items-center text-sm text-red-600 font-bold mb-4 mt-[-12px]">
                    <AiFillWarning className="text-2xl" />
                    Passwords do NOT match
                  </p>
                )}

                <div className="flex flex-col-reverse mb-8 relative mt-16 text-black">
                  <input
                    type="text"
                    required
                    placeholder=" "
                    id="fullName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                    className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
                  />

                  <label
                    htmlFor="fullName"
                    className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-70%] peer-focus:translate-y-[0] top-[-70%] transition-all duration-500 ease-linear"
                  >
                    Full name&nbsp;<span className="text-red-500">&#42;</span>
                  </label>
                </div>

                <div className="flex flex-col-reverse mb-4 relative mt-16 text-black">
                  <input
                    type="number"
                    maxLength={12}
                    required
                    placeholder=" "
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                    className="h-10 rounded-xl p-1 peer shadow-[0px_5px_15px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:ring-gray-600 disabled:text-gray-400"
                  />

                  <label
                    htmlFor="phoneNumber"
                    className="cursor-text font-bold text-sm p-1 absolute peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-focus:text-black peer-focus:top-[-70%] peer-focus:translate-y-[0] top-[-70%] transition-all duration-500 ease-linear"
                  >
                    Phone Number&nbsp;
                    <span className="text-red-500">&#42;</span>
                  </label>
                </div>

                {signUpError && (
                  <p className="flex items-center text-sm text-red-600 mb-4 mt-[-12px]">
                    <AiFillWarning className="text-2xl" />
                    {signUpError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={requestIsLoading}
                  onClick={() => {
                    if (password && password === confirmPassword) {
                      registerUser(signUpEmail, password);
                    } else if (password && password !== confirmPassword) {
                      setPasswordMatch(false);
                    }
                  }}
                  className="w-full uppercase font-bold relative flex items-center justify-center px-6 py-3 text-lg tracking-tighter text-white bg-gray-800 rounded-md group"
                >
                  <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-white rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-[#70dbb8] rounded-md "></span>
                  <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-white rounded-md opacity-0 group-hover:opacity-100 "></span>
                  <span className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-black flex items-center">
                    {requestIsLoading ? (
                      <Loader />
                    ) : (
                      <>
                        Sign up <HiOutlineLogin className="ml-2" />
                      </>
                    )}
                  </span>
                </button>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-black text-lg">
            <button
              type="button"
              onClick={() => {
                hideSignUpForm();
                showSignInForm();
              }}
              className="underline decoration-blue-600 decoration-[1.5px]"
            >
              Already have an account&#x3f;{" "}
              <span className="font-bold italic">Sign in</span>
            </button>
          </div>

          {/* <SignUpWithGoogle text={"Sign up with Google"} /> */}

          <button
            type="button"
            className="text-4xl absolute top-2 text-black right-3"
            onClick={hideSignUpForm}
          >
            <FaRegWindowClose />
          </button>
        </section>
      </div>
    </div>
  );
};

export default Sign_Up;
