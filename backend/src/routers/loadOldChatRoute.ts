import { Router } from "express";
import passport from "passport";
import { udohsDatabase } from "../utils/mongoDBClient";
import { chatsCollection } from "../utils/tsInterface";

// NOTE: THIS IS THE SAMPLE RESULT THAT WE WILL GET, IF WE DO 'console.log(messages)'
// NOTE: SO, IN THIS RESULT WE GOT TWO CHATS

// [
//   {
//       "_id": "670d0cf0af48b35cc7d21e7b",
//       "lastMessage": "New",
//       "readByReceiver": false,
//       "lastMessageDateAndTime": "2024-10-29T13:25:51.858Z",
//       "productTitle": "Testing the edit",
//       "otherPartnerID": "670d0a61a8b7a17e96b828f6",
//       "isCurrentUserTheLastMessageReceiver": false,
//       "otherPartnerFullName": "Udoh Abasi",
//       "otherPartnerProfilePicture": null,
//       "receiverID": "67021a5890f8b6ed17771bd5",
//       "lastMessageID": "67021a5890f8b6ed17771bd5"
//   },
//
//   {
//       "_id": "670d0cf0af48b35cc7d21e7a",
//       "lastMessage": "No",
//       "readByReceiver": false,
//       "lastMessageDateAndTime": "2024-10-29T12:57:51.957Z",
//       "productTitle": "Testing the edit",
//       "otherPartnerID": "67021a5890f8b6ed17771bd5",
//       "isCurrentUserTheLastMessageReceiver": true,
//       "otherPartnerFullName": "Elizabeth Paul",
//       "otherPartnerProfilePicture": null,
//       "receiverID": "67021a5890f8b6ed17771bd5",
//       "lastMessageID": "67021a5890f8b6ed17771bd5"
//   }
// ]

const router = Router();

// This get route returns all the chats that a particular user has
router.get(
  "/chats",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get the logged in user's ID
      const userID = req.user?._id;

      // Get the 'chat message' collection
      const chatsCollection =
        udohsDatabase.collection<chatsCollection>("chats");

      // Aggregate takes an array of commands (the pipeline)
      const messages = await chatsCollection
        .aggregate([
          // 1. We look for a match, using the '$or' operator to get all the chats that the logged in user is either 'chatPartner1' OR 'chatPartner2'
          {
            $match: {
              // The '$or' takes an array of commands, and if there is one match, that will be returned
              $or: [{ chatPartner1: userID }, { chatPartner2: userID }],
            },
          },

          // 2. We perform a lookup on the 'chatMessage' collection, to get the last message sent in this chat
          {
            $lookup: {
              from: "chatMessage", // Provide the name of the collection
              localField: "lastMessageId", // Provide the name of the current collection's field (i.e chat collection) to use for the lookup
              foreignField: "_id", // Provide which field to lookup against, in the foreign collection (i.e chatMessage collection)
              as: "theChatMessage", // The result this lookup will provide can be accessed using this name 'theChatMessage'
            },
          },

          // 3. Since the lookup will return an array, we get the first item in the array using '$first'.
          // Then we use '$set', which basically adds the key-value pair to the end result (unless we remove it with "unset")
          {
            $set: { theChatMessage: { $first: "$theChatMessage" } },
          },

          // 4. We set the values of the chatMessage to our final result as well
          {
            $set: {
              lastMessageID: "$theChatMessage._id",
              lastMessage: "$theChatMessage.message",
              readByReceiver: "$theChatMessage.readByReceiver",
              receiverID: "$theChatMessage.receiverID",
              lastMessageDateAndTime: "$theChatMessage.dateAndTime",
            },
          },

          // 5. Here, we want to user the productID to get the product that this chat is related to
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "theProduct",
            },
          },

          // 6. Get the array and set the first item in the array
          {
            $set: { theProduct: { $first: "$theProduct" } },
          },

          // 7. We just need the product's title at this time. So, we get that
          {
            $set: {
              productTitle: "$theProduct.title",
              // productCurrency: "$theProduct.currency",
              // productAmount: "$theProduct.amount",
            },
          },

          // 8. Here, we use the '$cond' to know if the currently logged in user is either chatPartner1 OR chatPartner2
          // And also, if the currently logged in user is the person meant to receive the last message or not
          // We can actually use "$set" here too, instead of "$addFields"
          {
            $addFields: {
              // This is the first field we are adding.
              // So, we know that there are two chat partners, which are,
              // 1. the currently logged in user (which can either be chatPartner1 OR chatPartner2) AND
              // 2. The other Partner (which also can either be chatPartner1 OR chatPartner2)
              // So here, we want to determine whether the other partner's ID is 'chatPartner1' OR 'chatPartner2'
              otherPartnerID: {
                $cond: {
                  if: { $eq: ["$chatPartner1", userID] }, // Check If the userID is equal to chatPartner1, then we set the field 'otherPartnerID' to 'chatPartner2', else, we set it to 'chatPartner1
                  then: "$chatPartner2",
                  else: "$chatPartner1",
                },
              },

              // Here, we want to check if the currently logged in user is the person meant to receive the last message
              isCurrentUserTheLastMessageReceiver: {
                $cond: {
                  if: { $eq: ["$receiverID", userID] },
                  then: true,
                  else: false,
                },
              },
            },
          },

          // 9. Here, we get the user that the currently logged in user is chatting with
          {
            $lookup: {
              from: "users",
              localField: "otherPartnerID",
              foreignField: "_id",
              as: "theOtherPartner",
            },
          },

          // 10. Spread the result gotten from the lookup above
          {
            $set: { theOtherPartner: { $first: "$theOtherPartner" } },
          },

          // 11. Then get the user's name and profile picture
          {
            $set: {
              otherPartnerFullName: "$theOtherPartner.fullName",
              otherPartnerProfilePicture: "$theOtherPartner.profilePicture",
            },
          },

          // 12. Then we use the '$unset' operator instead of '$project' to avoid modifying the aggregation pipeline since documents with different fields are added to the collection.
          // This takes out the fields we don't need in the final result
          {
            $unset: [
              "messages", // This field comes from 'chat' collection
              "lastMessageId", // This field comes from 'chat' collection
              "chatPartner1", // This field comes from 'chat' collection
              "chatPartner2", // This field comes from 'chat' collection
              "productID", // This field comes from 'chat' collection

              "theChatMessage", // This field comes from 'chatMessage' collection, (i.e, the entire result gotten when we made a query (i.e lookup) to the chatMessage collection)
              "theProduct", // This field comes from 'products' collection, (i.e, the entire result gotten when we made a query (i.e lookup) to the products collection)
              "theOtherPartner", // This field comes from 'users' collection, (i.e, the entire result gotten when we made a query (i.e lookup) to the users collection)
            ],
          },

          // 13. Finally, we want to sort our end result (in descending order) based on the date the last message was added.
          {
            $sort: {
              lastMessageDateAndTime: -1,
            },
          },
        ])
        .toArray();

      return res.status(200).json(messages);
    } catch {
      return res.sendStatus(400);
    }
  }
);

export default router;
