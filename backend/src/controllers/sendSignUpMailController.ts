import { Request, Response } from "express";
import sendMail from "../utils/sendMail";
import { udohsDatabase } from "../utils/mongoDBClient";
import {
  EmailAndVerificationCodeCollection,
  UserCollection,
} from "../utils/tsInterface";
import getSixRandomNumbers from "../utils/getSixRandomNumbers";

export const SendSignUpMail = async (req: Request, res: Response) => {
  try {
    // Get the email from the body
    const { email } = req.body;

    // Get the code
    const code = getSixRandomNumbers();

    if (email && code) {
      // Get the database and get the 'users', collection.
      // Specifying a TS Schema (TS Interface) is always optional, but it enables type hinting on
      const usersCollection = udohsDatabase.collection<UserCollection>("users");

      // Check if a user with that email already exist. If yes, DO NOT send email.
      // 'countDocuments' returns zero (0) if the item does not exist. It will work faster than 'findOne' bcoz it does not have to retrieve and return the found document, and 'email' is an indexed field
      const emailExist = await usersCollection.countDocuments({ email });

      // const emailExist = await usersCollection.findOne<
      //   Pick<UserCollection, "email">
      // >({
      //   email,
      // });

      if (!emailExist) {
        // If email does not exits, (this means a new user is about to be created), send the verification code to the email
        sendMail(email, code)
          .then(async () => {
            // If mail was sent successfully, we want to store the email and the code in the database. So first, we get the collection
            const emailAndVerificationCodeCollection =
              udohsDatabase.collection<EmailAndVerificationCodeCollection>(
                "emailAndVerificationCode"
              );

            // NOTE: We used 'updateOne' instead of 'findOneAndUpdate' because we don't want the document that was updated to be sent back
            const result = await emailAndVerificationCodeCollection.updateOne(
              {
                email, // The filter to find the document we want to update
              },

              { $set: { code } }, // Set the 'code' field to the same code sent to the user's email

              {
                upsert: true, // If no document matches the filter, this will create a new document
              }
            );

            // NOTE: 'result.acknowledged' will be true if everything went well and the document was successfully updated
            if (result.acknowledged) {
              res.status(200).json({ DOne: true });
            } else {
              res.status(404).json({ message: "An error occurred" });
            }
          })
          .catch((e) => {
            res
              .status(404)
              .json({ message: "There was an error sending the mail" });
          });
      } else {
        res
          .status(403)
          .json({ message: "A user with that email already exist" });
      }
    } else {
      res.status(404).json({ message: "There was an error sending the mail" });
    }
  } catch {
    res.status(404).json({ message: "An error occurred" });
  }
};
