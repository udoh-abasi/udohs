import { Router } from "express";
import passport from "passport";
import { udohsDatabase } from "../utils/mongoDBClient";
import { chatsCollection } from "../utils/tsInterface";
import { ObjectId } from "mongodb";

// NOTE: THIS IS THE SAMPLE RESULT THAT WE WILL GET, IF WE DO 'console.log(messages[0])'

//   {
//      "productID": "66f6b6c50943865aedd01cf5",

//     "otherPartnerID": "67021a5890f8b6ed17771bd5",

//     "otherPartnerFullName": "Elizabeth Paul",

//     "otherPartnerProfilePicture": "Udoh Abasi_2024-09-23T16-25-54.888Z.jpeg",

//     "productTitle": "Testing the edit",

//     "productCurrency": "36",

//     "productAmount": "1,000"

//     "groupedMessages": {
//         "2024-08-21": [  // NOTE: I HAVE JUST ONE MESSAGE FOR THIS DATE
//             {
//                 "_id": "67131dafbb23849b1bc7ce3f",
//                 "senderID": "66f1675f6965d3bd910943d8",
//                 "receiverID": "67021a5890f8b6ed17771bd5",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "Hello",
//                 "dateAndTime": "2024-08-21T12:40:39.171Z",
//                 "readByReceiver": false
//             }
//         ],

//         "2024-08-25": [    // NOTE: I HAVE THREE MESSAGES FOR THIS DATE
//             {
//                 "_id": "67131df2bb23849b1bc7ce40",
//                 "senderID": "67021a5890f8b6ed17771bd5",
//                 "receiverID": "670d0a61a8b7a17e96b828f6",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "How is life",
//                 "dateAndTime": "2024-08-25T10:00:39.171Z",
//                 "readByReceiver": false
//             },
//             {
//                 "_id": "670d0b56af48b35cc7d21e6e",
//                 "senderID": "66f1675f6965d3bd910943d8",
//                 "receiverID": "67021a5890f8b6ed17771bd5",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "Hello",
//                 "dateAndTime": "2024-08-25T10:11:39.171Z",
//                 "readByReceiver": false
//             },
//             {
//                 "_id": "670d0b56af48b35cc7d21e6f",
//                 "senderID": "66f1675f6965d3bd910943d8",
//                 "receiverID": "67021a5890f8b6ed17771bd5",
//                 "productID": "66f6b6c50943865aedd01cf5",
//                 "message": "Hi",
//                 "dateAndTime": "2024-08-25T10:12:39.171Z",
//                 "readByReceiver": false
//             }
//         ]
//     },
// }

const router = Router();

// This get route returns all the chats that a particular user has
router.get(
  "/chatmessage/:chatID",

  passport.authenticate("jwt", { session: false }),

  async (req, res) => {
    try {
      // Get the logged in user's ID
      const { chatID } = req.params;

      // Get the logged in user's ID
      const userID = req.user?._id;

      // Get the 'chat message' collection
      const chatsCollection =
        udohsDatabase.collection<chatsCollection>("chats");

      // Perform the aggregate to perform all actions at once
      const messages = await chatsCollection
        .aggregate([
          // 1. Find a match for the requested chat (using the chatID and the userID)
          {
            $match: {
              // Make sure there is a match for the ID
              _id: new ObjectId(chatID),

              // This is to ensure that, the user that sent a request for this chat is either 'chatPartner1' OR 'chatPartner2', to ensure data privacy, and that no other user can see other user's chat
              $or: [{ chatPartner1: userID }, { chatPartner2: userID }],
            },
          },

          // 2. When we get the chat, this lookup takes the 'messages', which is an array of chatMessage IDs. It basically uses the '$in' operator to return an array of all the documents that matches the IDs in the 'messages' array
          {
            $lookup: {
              from: "chatMessage",
              localField: "messages",
              foreignField: "_id",
              as: "theChat",
            },
          },

          // 3. Since 'theChat' is returned as an an array of chat messages, we want to destructure it, to get individual items in the array
          {
            $unwind: "$theChat",
          },

          // 4. Sort all messages by dateAndTime. This is done to ensure that, after grouping, the messages will still be arranged in ascending order (within the array of messages). So, the messages will be sorted by time
          {
            $sort: { "theChat.dateAndTime": 1 },
          },

          // 5. Group messages by date
          {
            $group: {
              // The '_id' takes which field name we want to use and group the results
              _id: {
                // $dateToString operator is used here to extract only the date part from dateAndTime.
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$theChat.dateAndTime",
                },
              },

              // So, for each chat message, mongodb will check the dateAndTime field, and extract the date, if the date matches, it creates a list here, and push the entire chat message into the list
              messages: { $push: "$theChat" },
              chatPartner1: { $first: "$chatPartner1" },
              chatPartner2: { $first: "$chatPartner2" },
              productID: { $first: "$productID" },
            },
          },

          // 6. Sort the groups by date
          {
            $sort: { _id: 1 },
          },

          // 7. Group all results back into a single document. Here, we want all the items to be one array
          // {
          //   $group: {
          //     _id: null,
          //     groupedMessages: { $push: "$$ROOT" }, // NOTE: $$ROOT pushes the entire document at the current stage, into the specified field (i.e 'groupedMessages' field)
          //     chatPartner1: { $first: "$chatPartner1" },
          //     chatPartner2: { $first: "$chatPartner2" },
          //     productID: { $first: "$productID" },
          //   },
          // },

          // 7. Group all results back into a single document
          // So, we want to have a field called 'groupedMessages', that in an object containing the 'message's date' as the key and the 'array of messages' as the value
          {
            $group: {
              _id: null,

              groupedMessages: {
                $push: {
                  // This will basically loop through the entire document and add the date and array of messages in the form '[ { k: '2024-08-21', v: [...messages] }, { k: '2024-08-25', v: [...messages] } ]'
                  k: "$_id", // The date as the key
                  v: "$messages", // The messages array as the value
                },
              },

              chatPartner1: { $first: "$chatPartner1" },

              chatPartner2: { $first: "$chatPartner2" },

              productID: { $first: "$productID" },
            },
          },

          // 8. Convert the array to object. So , we want to convert from this form '[ { k: '2024-08-21', v: [...messages] }, { k: '2024-08-25', v: [...messages] } ]' TO THIS { '2024-08-21' : [...messages], '2024-08-25' : [...messages] }
          {
            $set: {
              groupedMessages: { $arrayToObject: "$groupedMessages" },
            },
          },

          // 9. Get the other partner's ID
          {
            $addFields: {
              // So, we know that there are two chat partners, which are:
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
            },
          },

          // 10. Here, we get the user that the currently logged in user is chatting with
          {
            $lookup: {
              from: "users",
              localField: "otherPartnerID",
              foreignField: "_id",
              as: "theOtherPartner",
            },
          },

          // 11. Spread the result gotten from the lookup above
          {
            $set: { theOtherPartner: { $first: "$theOtherPartner" } },
          },

          // 12. Then get the user's name and profile picture
          {
            $set: {
              otherPartnerFullName: "$theOtherPartner.fullName",
              otherPartnerProfilePicture: "$theOtherPartner.profilePicture",
            },
          },

          // 13. Lookup to get the product they are chatting about
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "theProduct",
            },
          },

          // 14. Get the array and set the first item in the array
          {
            $set: { theProduct: { $first: "$theProduct" } },
          },

          // 15. We just need the product's title, currency and amount at this time. So, we get that
          {
            $set: {
              productTitle: "$theProduct.title",
              productCurrency: "$theProduct.currency",
              productAmount: "$theProduct.amount",
            },
          },

          // 16. Remove unwanted fields from the final result that will be sent to the frontend
          {
            $unset: [
              "_id",
              "chatPartner1",
              "chatPartner2",
              "theOtherPartner",
              "theProduct",
            ],
          },
        ])
        .toArray();

      // The aggregate operation will return an array, which will contain just a single object. So, we can get that single object from the array and send to the frontend
      return res.status(200).json(messages[0]);
    } catch (e) {
      console.log("Error", e);
      return res.sendStatus(400);
    }
  }
);

export default router;
