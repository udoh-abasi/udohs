import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import {
  UserCollection,
  EmailAndVerificationCodeCollection,
} from "../utils/tsInterface";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

const ForgotPassword = async (req: Request, res: Response) => {
  try {
    let {
      email,
      password,
      emailConfirmationCode: code, // Here, we renamed 'emailConfirmationCode' to 'code'
    } = req.body;

    code = code.trim();

    // Extract the validation errors on this request
    const validationErrors = validationResult(req);

    // 'validationErrors.isEmpty' returns True if there are no error. False otherwise
    if (validationErrors.isEmpty() && code) {
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

        // Get the 'users' collection
        const usersCollection =
          udohsDatabase.collection<UserCollection>("users");

        // Update the user's password with new password
        const result = await usersCollection.updateOne(
          { email },
          { $set: { password: hashPassword } }, // Update the password field with new password
          { upsert: false } // NOTE: This will ensure no new document is created, if the document we searched for does not exist
        );

        // NOTE: 'matchedCount' will be equal to one (1) if a document was found, and 'modifiedCount' will be one (1) if the document was document
        if (result.matchedCount === 1 && result.modifiedCount === 1) {
          return res.sendStatus(200);
        }
      }
    }

    return res.status(404).json({ message: "An error occurred" });
  } catch {
    return res.status(404).json({ message: "An error occurred" });
  }
};

export default ForgotPassword;
