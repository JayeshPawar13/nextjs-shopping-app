import { ObjectId } from "mongodb";

import clientPromise from "./mongodb";

import { Product } from "@/app/products/products.interface";
import { User } from "@/app/user.interface";
import { Cart } from "@/app/cart.interface";

export async function getProduct(productId: string) {
  const client = await clientPromise;
  const collection = client
    .db(process.env.mongodb_database)
    .collection<Product>("products");

  return await collection?.findOne({ _id: new ObjectId(productId) });
}

export async function getProducts() {
  const client = await clientPromise;
  const collection = client
    .db(process.env.mongodb_database)
    .collection<Product>("products");

  return await collection?.find({}).toArray();
}

export async function getUsers() {
  const client = await clientPromise;
  const collection = client
    .db(process.env.mongodb_user_database)
    .collection<User>("shopping-app-user");

  return await collection?.findOne({
    _id: new ObjectId("66e5e9e5f1bb7da2963ec428"),
  });
}

export async function getCart() {
  const client = await clientPromise;
  const collection = client
    .db(process.env.mongodb_database)
    .collection<Cart>("cart");

  return await collection?.findOne({ userId: "66e5e9e5f1bb7da2963ec428" });
}
