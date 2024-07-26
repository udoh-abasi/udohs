import { ObjectId } from "mongodb";

export interface UserCollection {
  _id?: string | ObjectId;
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  dateJoined: Date;
  profilePicture?: string | null;
}

export interface EmailAndVerificationCodeCollection {
  email: string;
  code: string;
  isVerified: boolean;
}
