import { Request, Response } from "express";
import { signInUserFunction } from "./signInController";

const signInWithGoogle = async (req: Request, res: Response) => {
  try {
    // Call the sign in function to sign in the user
    return await signInUserFunction(req, res, req.user?._id);
  } catch {
    return res.sendStatus(400);
  }
};

export default signInWithGoogle;
