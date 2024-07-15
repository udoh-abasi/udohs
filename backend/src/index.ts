import express, { Request, Response } from "express";
import cors from "cors";

import { config } from "dotenv";

config(); // Load .env file

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200, // NOTE: This is for some legacy browsers (IE11, various SmartTVs) that choke on 204
};

app.use(cors(corsOptions)); // NOTE: Here, we set up cors.

const GetCountry = async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://api.countrystatecity.in/v1/countries",
      {
        headers: {
          "X-CSCAPI-KEY": process.env.Country_State_City_API_KEY as string,
        },
        redirect: "follow",
      }
    );

    if (response.ok) {
      const data = await response.json();

      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "An error occured" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "An error occured" });
  }
};

const GetStateByCountry = async (req: Request, res: Response) => {
  // const { query } = req;
  const { countryCode } = req.params;

  try {
    const response = await fetch(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CSCAPI-KEY": process.env.Country_State_City_API_KEY as string,
        },
        redirect: "follow",
      }
    );

    if (response.ok) {
      const data = await response.json();

      res.status(200).json({ data });
    } else {
      console.log(response.status);
      res.status(404).json({ message: "An error occured" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "An error occured" });
  }
};

app.get("/api/getCountryStateCities/country", (req: Request, res: Response) => {
  GetCountry(req, res);
});

app.get(
  `/api/getCountryStateCities/getStateByCountry/:countryCode`,
  (req: Request, res: Response) => {
    GetStateByCountry(req, res);
  }
);

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
