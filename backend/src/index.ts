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
import productRouter from "./routers/productRoute";
import searchRouter from "./routers/searchRoute";
import bagRouter from "./routers/bagRoute";
import trendingSalesRouter from "./routers/trendingSalesRoute";
import userAdverts from "./routers/userAdverts";
import loadOldChatRoute from "./routers/loadOldChatRoute";
import loadChatMessageRoute from "./routers/loadChatMessage";
import markMessageAsReadRoute from "./routers/markMessageAsReadRoute";
import startChatRoute from "./routers/startChatRoute";
import { connectToMongo } from "./utils/mongoDBClient";
import createCollections from "./utils/createCollections";
import cookieParser from "cookie-parser";
import session from "express-session";
import passportSetUp from "./middlewares/passportSetUp";
import path from "path";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { UserCollection } from "./utils/tsInterface";
import passport from "passport";
import { AddNewChat, socketUtils } from "./utils/socket";

config(); // Load .env file

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "*"],
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
const myPassport = passportSetUp();

// Initialize passport
app.use(myPassport.initialize());

// Passport to use sessions. This is compulsory, even if you are NOT using sessions authentication
app.use(myPassport.session());

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
  productRouter,
  searchRouter,
  bagRouter,
  trendingSalesRouter,
  userAdverts,
  loadOldChatRoute,
  loadChatMessageRoute,
  markMessageAsReadRoute,
  startChatRoute,
]);

app.get("/home", (req, res) => {
  res.status(200).json("Welcome, your app is working well");
});

// NOTE: Because we are using socket.io, this is how we are expected to create our server
const httpServer = createServer(app);

// Initialize socket.io. NOTE: passing in 'app' instead of 'httpServer' will cause an error. Socket.io expects a 'httpServer'
export const io = new Server(httpServer, {
  /* options */

  // Provide cors else there will be errors, since the frontend and backend are hosted on different domains
  cors: corsOptions,
});

// Type definition for authenticated socket
export interface AuthenticatedSocket extends Socket {
  user?: UserCollection;
}

// Middleware for authenticating socket connections
io.use((socket: AuthenticatedSocket, next) => {
  // Extract token from socket handshake headers
  const tokenString = socket.handshake.headers.cookie;

  // Since the token is sent as a string in the form "token=gcu3dg7264gh2vhv1y21xsq", we basically have to take out 'token=' from the string
  const token = tokenString?.replace("token=", "");

  if (!token) {
    return next(new Error("Authentication error: Token required"));
  }

  // Create a fake request object that Passport expects.
  // Since passport expects the 'req' to be an object that has the 'cookies' as key, we set up the object in a way that passport JWT wants
  const fakeReq = {
    cookies: { token },
  };

  // Create a fake response object
  const fakeRes = {};

  // Use Passport authentication
  passport.authenticate(
    "jwt",

    { session: false },

    // The third argument is the function that we use to handle a successful or failed serialization of a user by passport
    (err: Error, user: UserCollection) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      // The user will be 'false', if a wrong token, or no token was sent
      if (!user) {
        return next(new Error("Invalid token"));
      }

      // Attach the authenticated user to the socket
      socket.user = user;

      // This will allow for a connection to be done
      next();
    }
  )(fakeReq, fakeRes, next); // The 'passport.authenticate' is called immediately by we providing '(fakeReq, fakeRes, next)' here
});

interface connectedUsersInterface {
  [key: string]: string;
}

const connectedUsers: connectedUsersInterface = {};

// Handle socket connections
io.on("connection", (socket: AuthenticatedSocket) => {
  // Add the user's ID and the ID of the socket the user connected to, to the array of connected users
  if (socket.user?._id) {
    connectedUsers[socket.user?._id.toString()] = socket.id;
  }

  // Check if user is already connected from another device
  if (socket.user?._id) {
    const existingSockets = socketUtils.getUserSockets(
      socket.user._id.toString()
    );

    if (existingSockets.length > 0) {
      console.log(`User ${socket.user?.email} connected from another device`);
    }
  }

  // Handle when we get a message from the frontend
  socket.on("chatFromFrontend", async (msg) => {
    // Put the message in the database, and send to user (if they are online)
    if (socket.user?._id) {
      try {
        const currentDateAndTime = new Date();

        // Send the message to the chat partner that the message was sent to
        // Send the message (only to that socket ID). If the socket ID does NOT exist, then, NO error will be thrown. The message just won't be sent
        socket.broadcast
          .to(connectedUsers[msg.to]) // Here, 'connectedUsers[msg.to]' gets the socket ID
          .emit("chatFromBackend", {
            message: msg.trimmedMessage,
            _id: currentDateAndTime.toISOString(),
            senderID: socket.user._id,
            receiverID: msg.to,
            productID: msg.productID,
            dateAndTime: currentDateAndTime.toISOString(),
            readByReceiver: false,
          });

        // Put the message in the database
        await AddNewChat(
          socket.user?._id.toString(),
          msg.to,
          msg.productID,
          msg.trimmedMessage,
          msg.chatID,
          currentDateAndTime
        );
      } catch {
        //
      }
    }

    // socketUtils.sendToUser(`${msg.to}`, "chatFromBackend", `${msg.message}`);
  });

  // sending to individual socketid
  //  socket.broadcast.to(socketid).emit('message', 'for your eyes only');

  // Handle socket disconnection
  socket.on("disconnect", () => {
    if (socket.user?._id) {
      delete connectedUsers[socket.user?._id?.toString()];
    }
  });
});

// Connect to mongodb, and if successful, create collections and start the app
connectToMongo()
  .then(async () => {
    // Create all the collections needed in the database
    await createCollections();

    // Start the app. NOTE: Here, we used 'httpServer.listen' instead of 'app.listen'. This is because we are using socket.io
    // Using 'app.listen' will NOT work, as it creates a new HTTP server
    httpServer.listen(process.env.PORT, () => {
      console.log("Server is listening on port", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("The error", e);
  });
