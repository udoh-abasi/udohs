import { Request, Response } from "express";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";

const SignIn = async (req: Request, res: Response) => {
  console.log("Got request in sign in");
  console.log(req.body);
  res.sendStatus(400);
};

export default SignIn;
