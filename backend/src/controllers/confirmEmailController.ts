import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { EmailAndVerificationCodeCollection } from "../utils/tsInterface";

const ConfirmEmail = async (req: Request, res: Response) => {
  // Get the email and code from the body
  const { email, code } = req.body;

  if (email && code) {
    const emailAndVerificationCodeCollection =
      udohsDatabase.collection<EmailAndVerificationCodeCollection>(
        "emailAndVerificationCode"
      );

    const result = await emailAndVerificationCodeCollection.findOne({
      email,
      code,
    });

    if (result) {
      await emailAndVerificationCodeCollection.deleteOne({ email, code });
      res.status(200).json({ Done: true });
    } else {
      res.status(404).json({ message: "Email or code not found" });
    }
  } else {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export default ConfirmEmail;
