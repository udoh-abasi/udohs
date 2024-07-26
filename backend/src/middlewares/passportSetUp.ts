import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { udohsDatabase } from "../utils/mongoDBClient";
import { UserCollection } from "../utils/tsInterface";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

// Augment the Express.User interface. If not, we will get errors below, that '_id' is not on type User
declare global {
  namespace Express {
    interface User extends UserCollection {} // Extend the default 'User' interface that passport user, to contain the properties in the 'UserCollection' interface
  }
}

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
            { email },
            { projection: { _id: 1, email: 1, password: 1 } } // Get only the '_id', 'email' and 'password' fields. Ignore every other field
          );

          console.log("The user is", user);

          if (user) {
            // If we got a user, we confirm the password they provided is same as what they stored in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
              return done(null, user); // Return the user if everything went well
            }
          }

          return done(null, false); // Terminate the action (this returns 404) if either the user does not exist or password does not match
        } catch (err) {
          return done(err); // Terminate the action (this returns 404)
        }
      }
    )
  );

  // This will store the user's ID in the session as (req.session.passport.user)
  passport.serializeUser((user: Express.User, done) => {
    done(null, user._id);
  });

  // On every request, this will take the 'userID' stored in the session, and use it to retrieve the user from the database, and make the user available on 'req.user'
  passport.deserializeUser(async (userID: string, done) => {
    try {
      const userCollection = udohsDatabase.collection<UserCollection>("users");

      const user = await userCollection.findOne(
        { _id: new ObjectId(userID) },
        { projection: { _id: 1, email: 1, password: 1 } }
      );

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  return passport; // NOTE: This function returns the passport we imported
};

export default passportSetUp;
