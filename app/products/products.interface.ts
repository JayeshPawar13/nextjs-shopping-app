import { ObjectId } from 'mongodb';

export interface Product {
  _id: ObjectId;
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  brand: string;
  category: string;
  isNew: boolean;
}
