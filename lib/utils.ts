import { Collection, ObjectId } from 'mongodb';

import clientPromise from './mongodb';

import { Product } from '@/app/products/products.interface';
import { User } from '@/app/user.interface';
import { Cart } from '@/app/cart/cart.interface';

type CollectionName = 'cart' | 'products' | 'shopping-app-user';
type CollectionType<T extends CollectionName> = T extends 'cart'
  ? Cart
  : T extends 'products'
    ? Product
    : T extends 'shopping-app-user'
      ? User
      : never;

const getCollection = async <T extends CollectionName>(
  collectionName: T
): Promise<Collection<CollectionType<T>>> => {
  const client = await clientPromise;

  return client
    .db(
      collectionName == 'shopping-app-user'
        ? process.env.mongodb_user_database
        : process.env.mongodb_database
    )
    .collection<CollectionType<T>>(collectionName);
};

export async function getProduct(productId: string) {
  const collection = await getCollection('products');
  const result = await collection?.findOne({ _id: new ObjectId(productId) });

  return JSON.parse(JSON.stringify(result));
}

export async function getProducts() {
  const collection = await getCollection('products');
  const result = await collection?.find({}).toArray();

  return JSON.parse(JSON.stringify(result));
}

export async function getUsers() {
  const collection = await getCollection('shopping-app-user');
  const result = await collection?.findOne({
    _id: new ObjectId('66e5e9e5f1bb7da2963ec428'),
  });

  return JSON.parse(JSON.stringify(result));
}

export async function getCart() {
  const collection = await getCollection('cart');
  const result = await collection?.findOne({
    userId: '66e5e9e5f1bb7da2963ec428',
  });

  return JSON.parse(JSON.stringify(result));
}
