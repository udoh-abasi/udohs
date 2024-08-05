import { Request, Response } from "express";

export const frontendURL = "http://localhost:5173";

const sendGoogleLink = (req: Request, res: Response) => {
  try {
    // Construct the authorization URL
    const auth_url =
      "https://accounts.google.com/o/oauth2/auth?" +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.GOOGLE_CLIENT_ID as string, // NOTE: This must be a string, else TS will raise as error
        redirect_uri: frontendURL,
        scope: "openid email profile",
      });

    return res.status(200).json({ auth_url });
  } catch {
    return res.sendStatus(404);
  }
};

export default sendGoogleLink;
