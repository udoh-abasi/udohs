import express from "express";
import cors from "cors";
import { config } from "dotenv";
import countryStateRouter from "./routers/CountryAndStateRoute";
import sendSignUpMailRouter from "./routers/sendSignUpMailRoute";
import confirmMailRouter from "./routers/confirmEmailRoute";
import signUpRouter from "./routers/signUpRoute";
import signInRouter from "./routers/signInRoute";
import getUserRouter from "./routers/userRoute";
import logoutRouter from "./routers/logoutRoute";
import forgotPasswordMailRouter from "./routers/sendForgotPasswordMailRoute";
import forgotPasswordRouter from "./routers/forgotPasswordRoute";
import getGoogleLinkRouter from "./routers/sendGoogleLinkRoute";
import signInWithGoogleRouter from "./routers/signInWithGoogleRoute";
import editUserRouter from "./routers/editUserRoute";
import { connectToMongo } from "./utils/mongoDBClient";
import createCollections from "./utils/createCollections";
import cookieParser from "cookie-parser";
import session from "express-session";
import passportSetUp from "./middlewares/passportSetUp";
import path from "path";

config(); // Load .env file

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200, // NOTE: This is for some legacy browsers (IE11, various SmartTVs) that choke on 204
};

app.use(cors(corsOptions)); // NOTE: Here, we set up cors.

app.use(express.json()); // Enables getting data from 'req.body'

// Set up static file serving. On development, if you console.log this 'imageDirectory', you will see 'C:\Users\dell\Desktop\udohs\backend/src/public
export const imageDirectory = path.join(__dirname, "public"); // NOTE: This is the directory where we want to store image files. So, '__dirname' will give us the directory where this file is located in
app.use("/image", express.static(imageDirectory)); // NOTE: The '/image' means we will have access to the 'imageDirectory' by visiting /image. E.g, we can access a file called 'myPhoto.jpg' in the 'profileImage' folder by visiting 'http://localhost:8000/image/profileImages/myPhoto.jpg'

// Initialize session management with cookie-session. This is compulsory, even if you are NOT using sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    name: "sessionID",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(cookieParser()); // NOTE: This gives us the headers in req.cookies

// Set up passport
const passport = passportSetUp();

// Initialize passport
app.use(passport.initialize());

// Passport to use sessions. This is compulsory, even if you are NOT using sessions
app.use(passport.session());

// NOTE: This is the route to get all the countries and states
app.use("/api/getCountryStateCities", countryStateRouter);

// Set up all the routes to be mounted on '/api'
app.use("/api", [
  sendSignUpMailRouter,
  confirmMailRouter,
  signUpRouter,
  signInRouter,
  getUserRouter,
  logoutRouter,
  forgotPasswordMailRouter,
  forgotPasswordRouter,
  getGoogleLinkRouter,
  signInWithGoogleRouter,
  editUserRouter,
]);

// Connect to mongodb, and if successful, create collections and start the app
connectToMongo()
  .then(async () => {
    // Create all the collections needed in the database
    await createCollections();

    // Start the app
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on port", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("The error", e);
  });
