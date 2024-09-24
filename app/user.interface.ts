import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  roles: string[];
  preferences: { theme: string; notifications: { email: true; sms: false } };
}
