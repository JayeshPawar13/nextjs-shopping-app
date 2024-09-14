import { WithId } from "mongodb";

export interface Product extends WithId<Document> {
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
