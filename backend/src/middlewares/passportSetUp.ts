import passport from "passport";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { decryptText } from "../utils/encryptAndDecryptText";
import { frontendURL } from "../controllers/sendGoogleLinkController";

// Augment the Express.User interface. If not, we will get errors below, that '_id' is not on type User
declare global {
  namespace Express {
    interface User extends UserCollection {} // Extend the default 'User' interface that passport uses, to contain the properties in the 'UserCollection' interface
  }
}

// NOTE: This function extracts the 'jwt' token from the request. req.cookies will hold the JWT because we used 'cookie-parser'
const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }

  if (token) {
    // Decrypt the token and return
    return decryptText(token);
  }

  // So, we return null here, if there is no token
  return token;
};

// NOTE: This function has to be called to set up passport
const passportSetUp = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true }, // State that 'usernameField' is called 'email', if not passport will look for the 'username' field
      async (req, email, password, done) => {
        try {
          // Get the collection
          const userCollection =
            udohsDatabase.collection<UserCollection>("users");

          // Find the user
          const user = await userCollection.findOne(
            { email }
            // { projection: { _id: 1, email: 1, password: 1 } } // Get only the '_id', 'email' and 'password' fields. Ignore every other field
          );

          if (user) {
            // If we got a user, we confirm the password they provided is same as what they stored in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
              return done(null, user); // Return the user if everything went well. Now, the user will be available on 'req.user'
            }
          }

          return done(null, false); // Terminate the action (this returns 404) if either the user does not exist or password does not match
        } catch (err) {
          return done(err); // Terminate the action (this returns 404)
        }
      }
    )
  );

  // SET UP JWT
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor, // Get the jwt token
        secretOrKey: process.env.SESSION_SECRET as string, // Same secret that was used to sign the token is used here
        ignoreExpiration: false,
        passReqToCallback: true,
      },
      async (req, JWTPayload, done) => {
        try {
          const userCollection =
            udohsDatabase.collection<UserCollection>("users");

          const user = await userCollection.findOne(
            { _id: ObjectId.createFromHexString(JWTPayload.userID) }, // We search for the user using the userID we stored in the jwt payload (during signIn or signUp). Use 'ObjectId.createFromHexString' to avoid errors,
            { projection: { password: 0, providerID: 0, provider: 0 } } // We just want 'req.user' to hold everything except password, provider and providerID fields
          );

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // SET UP SIGN IN WITH GOOGLE
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: frontendURL, // NOTE: This is same as the 'Authorization callback URL' we provided on the GitHub site when setting up the app
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        // NOTE: The accessToken is used if we want to make subsequent API request to Google, on-behalf of the user
        // NOTE: The refreshToken will be used to refresh the accessToken if it expires.
        // The profile contains the user's identity

        try {
          // Hash the default password meant for all users that signed in with google
          const hashPassword = await bcrypt.hash(
            process.env.GOOGLE_USER_PASSWORD as string,
            10 // 10 is the saltRounds
          );

          // Get the email
          const email = profile._json.email as string;
          const password = hashPassword;

          // Get the database and get the 'users', collection.
          // Specifying a TS Schema (TS Interface) is always optional, but it enables type hinting on
          const usersCollection =
            udohsDatabase.collection<UserCollection>("users");

          // Check if a user with that email already exist, then update their password with the default password and sign them in
          // So, we assumed a user with that email already exist, then we try to update their password at once. We do both in one request
          const user = await usersCollection.findOneAndUpdate(
            { email },
            { $set: { password } }, // Update the password field with new password
            { upsert: false, returnDocument: "after" } // NOTE: 'upsert' set to false will ensure no new document is created, if the document we searched for does not exist, while 'returnDocument' set to 'after' will ensure we get the updated document rather than the original
          );

          // If a user was updated (meaning the user already exist in our database), we return the user
          if (user) {
            return done(null, user);
          }

          // First Get the current date and time
          const now = new Date();

          const provider = profile.provider; // NOTE: This will always give us 'google'
          const providerID = profile.id; // NOTE: This will give us the user's id, which is always same for a particular user

          const fullName = profile.displayName;
          const profilePicture = null;
          const phoneNumber = "";
          const dateJoined = now;

          // If a user was NOT found, then we create a new user
          if (provider && providerID && fullName) {
            // Since insertOne does not return the inserted document, we use 'findOneAndUpdate', and we set 'upsert: true' so we can create and get back the document in one operation
            const newUser = await usersCollection.findOneAndUpdate(
              { email },
              {
                $set: {
                  password,
                  profilePicture,
                  providerID,
                  provider,
                  fullName,
                  phoneNumber,
                  dateJoined,
                  bag: [],
                },
              },
              { upsert: true, returnDocument: "after" }
            );

            if (newUser) {
              return done(null, newUser);
            }
          }

          return done(null, false);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // NOTE: THE BELOW CODE WOULD BE RELEVANT IF WE USED 'sessions' FOR MANAGING USERS, BUT WE USED 'jwt', SO THEY ARE NOT NEEDED

  // // This will store the user's ID in the session as (req.session.passport.user)
  // passport.serializeUser((user: Express.User, done) => {
  //   done(null, user._id);
  // });

  // // On every request, this will take the 'userID' stored in the session, and use it to retrieve the user from the database, and make the user available on 'req.user'
  // passport.deserializeUser(async (userID: string, done) => {
  //   try {
  //     const userCollection = udohsDatabase.collection<UserCollection>("users");

  //     const user = await userCollection.findOne(
  //       { _id: ObjectId.createFromHexString(userID) }, // Providing the userID without passing it into 'ObjectId.createFromHexString' will cause a 'user not found' error
  //       { projection: { _id: 1, email: 1 } }
  //     );

  //     return done(null, user);
  //   } catch (err) {
  //     return done(err);
  //   }
  // });

  return passport; // NOTE: This function returns the passport we imported
};

export default passportSetUp;
