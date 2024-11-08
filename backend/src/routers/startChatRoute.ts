import { Router } from "express";
import passport from "passport";
import { udohsDatabase } from "../utils/mongoDBClient";
import { chatsCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const router = Router();

router.post(
  "/startchat",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { productID, productOwnerID, message } = req.body;
      productID = productID.trim();
      productOwnerID = productOwnerID.trim();
      message = message.trim();

      // Get the logged in user
      const userID = req.user?._id;

      if (
        message &&
        productID &&
        productOwnerID &&
        userID &&
        userID !== productOwnerID
      ) {
        // Get the chat message collection
        const chatMessageCollection = udohsDatabase.collection("chatMessage");

        // Add the chat to the database.
        const theMessage = await chatMessageCollection.insertOne({
          senderID: new ObjectId(userID),
          receiverID: new ObjectId(productOwnerID as string),
          productID: new ObjectId(productID as string),
          message,
          dateAndTime: new Date(),
          readByReceiver: false,
        });

        // If the chat message was added successfully, we then add the chatMessageID to the chat
        if (theMessage.acknowledged) {
          // Get the 'chat message' collection
          const chatsCollection =
            udohsDatabase.collection<chatsCollection>("chats");

          // Check if there is a chat between this two users
          const theChat = await chatsCollection.findOneAndUpdate(
            {
              $or: [
                {
                  chatPartner1: new ObjectId(userID as string),
                  chatPartner2: new ObjectId(productOwnerID as string),
                },
                {
                  chatPartner1: new ObjectId(productOwnerID as string),
                  chatPartner2: new ObjectId(userID as string),
                },
              ],
            },

            {
              $set: {
                productID: new ObjectId(productID as string),
                lastMessageId: theMessage.insertedId,
              },

              $push: { messages: theMessage.insertedId },
            },

            {
              returnDocument: "after",
              upsert: false,
              projection: { _id: 1 },
            }
          );

          if (theChat) {
            return res.status(200).json(theChat._id);
          } else {
            // That means these two users have no chat together. So, create one
            const newChat = await chatsCollection.insertOne({
              chatPartner1: new ObjectId(productOwnerID as string),
              chatPartner2: new ObjectId(userID as string),
              lastMessageId: theMessage.insertedId,
              messages: [theMessage.insertedId],
              productID: new ObjectId(productID as string),
            });

            if (newChat.acknowledged) {
              return res.status(200).json(newChat.insertedId);
            }
          }
        }
      }

      return res.sendStatus(400);
    } catch (e) {
      console.log("Error in getting user", e);
      return res.sendStatus(400);
    }
  }
);

export default router;
