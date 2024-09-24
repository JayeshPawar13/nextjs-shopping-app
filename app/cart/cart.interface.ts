import { ObjectId } from 'mongodb';

export interface Cart {
  userId: ObjectId | string;
  items: {
    productId: ObjectId | string;
    quantity: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}
