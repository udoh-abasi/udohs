import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { encryptText } from "../utils/encryptAndDecryptText";
import { ObjectId } from "mongodb";

// This is a helper function that just generates the JWT token, encrypt it and set as a cookie in the frontend.
// It was defined separately because we used it in the 'signUp' controller and 'signInWithGoogle' controller as well
export const signInUserFunction = async (
  req: Request,
  res: Response,
  theID: string | ObjectId | undefined
) => {
  if (theID) {
    // Sign the token
    const token = jwt.sign(
      { userID: theID }, // This is the payload
      process.env.SESSION_SECRET as string, // Pass in the secret
      { expiresIn: "3 days" } // Token to expire in 3 days
    );

    // Encrypt the token before sending to the frontend
    const encryptedToken = encryptText(token);

    // Setting the cookie from the backend, for security.
    res.cookie("token", encryptedToken, {
      httpOnly: true, // Makes the token only accessible by the server (backend)
      secure: true, // Ensure the cookie is used via HTTPS only
      sameSite: "strict",
    });

    return res.status(200).json({
      id: req.user?._id,
      email: req.user?.email,
      phoneNumber: req.user?.phoneNumber,
      fullName: req.user?.fullName,
      dateJoined: req.user?.dateJoined,
      profilePicture: req.user?.profilePicture,
    });
  } else {
    console.log("Error no ID", theID);
    return res.sendStatus(400);
  }
};

// This is the main signIn controller
const SignIn = async (req: Request, res: Response) => {
  try {
    return await signInUserFunction(req, res, req.user?._id);
  } catch (e) {
    console.log("The error", e);
    return res.sendStatus(400);
  }
};

export default SignIn;
