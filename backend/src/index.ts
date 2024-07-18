import express from "express";
import cors from "cors";
import { config } from "dotenv";
import countryStateRouter from "./routers/CountryAndStateRoute";
import { connectToMongo } from "./utils/mongoDBClient";

config(); // Load .env file

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200, // NOTE: This is for some legacy browsers (IE11, various SmartTVs) that choke on 204
};

app.use(cors(corsOptions)); // NOTE: Here, we set up cors.

// NOTE: This is the route to get all the countries and states
app.use("/api/getCountryStateCities", countryStateRouter);

// Connect to mongodb, and if successful, start the app
connectToMongo()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on port", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("The error", e);
  });
