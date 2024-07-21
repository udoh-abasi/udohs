export interface UserCollection {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  dateJoined: Date;
  profilePicture?: string;
}

export interface EmailAndVerificationCodeCollection {
  email: string;
  code: string;
}
