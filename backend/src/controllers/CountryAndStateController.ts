import { Request, Response } from "express";

// NOTE: This function gets all the countries in the world and sends to the frontend
export const GetCountry = async (req: Request, res: Response) => {
  try {
    // Make a Get request to the API to get the data
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
      res.status(404).json({ message: "An error occurred" });
    }
  } catch (e) {
    res.status(404).json({ message: "An error occurred" });
  }
};

// NOTE: Given the country code, this functions gets all the states in that country and sends to the frontend
export const GetStateByCountry = async (req: Request, res: Response) => {
  const { countryCode } = req.params;

  try {
    // Make a Get request to the API to get the data
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
      res.status(404).json({ message: "An error occurred" });
    }
  } catch (e) {
    res.status(404).json({ message: "An error occurred" });
  }
};
