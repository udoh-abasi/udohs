import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import {
  UserCollection,
  EmailAndVerificationCodeCollection,
} from "../utils/tsInterface";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { signInUserFunction } from "./signInController";

const SignUp = async (req: Request, res: Response) => {
  try {
    let {
      email,
      password,
      fullName,
      phoneNumber,
      emailConfirmationCode: code, // Here, we renamed 'emailConfirmationCode' to 'code'
    } = req.body;

    fullName = fullName.trim();
    phoneNumber = phoneNumber.trim();
    code = code.trim();

    // Extract the validation errors on this request
    const validationErrors = validationResult(req);

    // 'validationErrors.isEmpty' returns True if there are no error. False otherwise
    if (validationErrors.isEmpty() && fullName && phoneNumber && code) {
      // Get the 'emailAndVerificationCode' collection
      const emailAndVerificationCodeCollection =
        udohsDatabase.collection<EmailAndVerificationCodeCollection>(
          "emailAndVerificationCode"
        );

      // Here, we delete the user's details from the 'emailAndVerificationCode' collection
      const result = await emailAndVerificationCodeCollection.deleteOne({
        email,
        code,
        isVerified: true,
      });

      // NOTE: 'deletedCount' will be one (1) if a document was found and deleted. This will also mean the user's email was verified previously
      if (result.deletedCount === 1) {
        // Hash the user's password
        const hashPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Get the users collection
        const usersCollection =
          udohsDatabase.collection<UserCollection>("users");

        // Get the current date and time
        const now = new Date();

        // If a new user was inserted successfully, then 'result.acknowledged' will be true
        // There is no point checking if a user with that email already exist, because if they do, an error will be thrown, since the 'email' field is an indexed field
        const result = await usersCollection.insertOne({
          dateJoined: now,
          password: hashPassword,
          profilePicture: null,
          providerID: null,
          provider: "appUser",
          email,
          fullName,
          phoneNumber,
        });

        if (result.acknowledged) {
          // Call the sign in function to sign in the user
          return await signInUserFunction(req, res, result.insertedId);
        }
      }
    }

    return res.status(404).json({ message: "An error occurred" });
  } catch {
    return res.status(404).json({ message: "An error occurred" });
  }
};

export default SignUp;
