import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { EmailAndVerificationCodeCollection } from "../utils/tsInterface";

const ConfirmEmail = async (req: Request, res: Response) => {
  try {
    // Get the email and code from the body
    const { email, code } = req.body;

    if (email && code) {
      // Get the collection
      const emailAndVerificationCodeCollection =
        udohsDatabase.collection<EmailAndVerificationCodeCollection>(
          "emailAndVerificationCode"
        );

      // To save time and increase performance, we used 'updateOne', which will search for the email and code first, if it exist, the 'isVerified' will be updated, but if it does not exist, we get an error
      // if email and code is found, update 'isVerified' property to true. The signUp route will check if this 'isVerified' is true, before signing up the user
      const result = await emailAndVerificationCodeCollection.updateOne(
        { email, code },
        { $set: { isVerified: true } },
        { upsert: false } // NOTE: This will ensure no new document is created, if the document we searched for does not exist
      );

      // NOTE: 'matchedCount' will be equal to one (1) if a document was found, and 'modifiedCount' will be one (1) if the document was document
      if (result.matchedCount === 1 && result.modifiedCount === 1) {
        return res.status(200).json({ Done: true });
      } else {
        return res.status(404).json({ message: "Something went wrong" });
      }
    } else {
      return res.status(404).json({ message: "Something went wrong" });
    }
  } catch {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export default ConfirmEmail;
