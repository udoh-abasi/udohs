import { ObjectId } from "mongodb";

export interface UserCollection {
  _id?: string | ObjectId;
  providerID: string | null;
  provider: "appUser" | "google";
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  dateJoined: Date;
  profilePicture?: string | null;
  bag: string[];
}

export interface EmailAndVerificationCodeCollection {
  email: string;
  code: string;
  isVerified: boolean;
}

export interface ProductCollection {
  _id?: string | ObjectId;
  productOwnerID: string | ObjectId;
  country: string;
  state: string;
  currency: string;
  amount: string;
  title: string;
  description: string;
  photos: string[];
  dateAdded: Date;
  category:
    | "vehicle"
    | "phone"
    | "computer"
    | "homeAppliances"
    | "fashion"
    | "properties"
    | "others";
}

export interface chatMessageCollection {
  _id?: string | ObjectId;
  senderID: ObjectId;
  receiverID: ObjectId;
  productID: ObjectId;
  message: string;
  dateAndTime: Date;
  readByReceiver: boolean;
}

export interface chatsCollection {
  _id?: string | ObjectId;
  chatPartner1: ObjectId;
  chatPartner2: ObjectId;
  productID: ObjectId;
  messages: ObjectId[];
  lastMessageId: ObjectId;
}
