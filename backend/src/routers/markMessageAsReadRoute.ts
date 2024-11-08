import { Router } from "express";
import passport from "passport";
import { udohsDatabase } from "../utils/mongoDBClient";
import { chatMessageCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

const router = Router();

// This get route marks the latest message of a chat as read
router.put(
  "/markmessageasread/:lastMessageID",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    try {
      // Get the logged in user's ID
      const { lastMessageID } = req.params;

      const chatMessageCollection =
        udohsDatabase.collection<chatMessageCollection>("chatMessage");

      await chatMessageCollection.findOneAndUpdate(
        {
          // Make sure there is a match for the ID
          _id: new ObjectId(lastMessageID),

          // This is to ensure that, the user that sent a request for this chat is actually the receiver of the chat chat
          receiverID: new ObjectId(req.user?._id),
        },

        {
          $set: { readByReceiver: true },
        },

        {
          upsert: false,
        }
      );

      return res.sendStatus(200);
    } catch (e) {
      console.log("Error", e);
      return res.sendStatus(400);
    }
  }
);

export default router;
