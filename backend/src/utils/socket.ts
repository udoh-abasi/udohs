import { ObjectId } from "mongodb";
import { AuthenticatedSocket, io } from "..";
import { udohsDatabase } from "./mongoDBClient";
import { chatsCollection } from "./tsInterface";

// Utility functions for socket management
export const socketUtils = {
  // Send a message to a specific user
  sendToUser: (userId: string, event: string, data: any) => {
    // Find the user from the list of connected users
    const userSocket = Array.from(io.sockets.sockets.values()).find(
      (socket: AuthenticatedSocket) => socket.user?._id?.toString() === userId
    );

    // If user is found (that means user is online), we send the message to the user
    if (userSocket) {
      userSocket.emit(event, data);
    }
  },

  // Get all connected sockets for a user
  getUserSockets: (userId: string) => {
    return Array.from(io.sockets.sockets.values()).filter(
      (socket: AuthenticatedSocket) => socket.user?._id === userId
    );
  },

  // Check if a user is online
  isUserOnline: (userId: string) => {
    const userSockets = socketUtils.getUserSockets(userId);
    return userSockets.length > 0;
  },
};

export const AddNewChat = async (
  loggedInUserID: string,
  receiverID: string,
  productID: string,
  message: string,
  chatID: string,
  dateAndTime: Date
) => {
  // Add the chat to the chatMessage collection.
  const chatMessageCollection = udohsDatabase.collection("chatMessage");

  const theMessage = await chatMessageCollection.insertOne({
    senderID: new ObjectId(loggedInUserID),
    receiverID: new ObjectId(receiverID),
    productID: new ObjectId(productID),
    message,
    dateAndTime,
    readByReceiver: false,
  });

  // Add the chatMessage ID to the array of the chats, and also update the lastMessageID
  const chatCollection = udohsDatabase.collection<chatsCollection>("chats");

  await chatCollection.findOneAndUpdate(
    {
      // Make sure there is a match for the ID
      _id: new ObjectId(chatID),

      // This is to ensure that, the user that sent a request for this chat is either 'chatPartner1' OR 'chatPartner2', to ensure data privacy, and that no other user can see other user's chat
      $or: [
        { chatPartner1: new ObjectId(loggedInUserID) },
        { chatPartner2: new ObjectId(loggedInUserID) },
      ],
    },

    {
      $push: { messages: theMessage.insertedId }, // Add the message ID to the array of messages
      $set: { lastMessageId: theMessage.insertedId }, // This message is obviously the last message for this chat, so update the last message ID
    },

    {
      upsert: false,
    }
  );
};
