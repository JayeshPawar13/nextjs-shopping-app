import { NextRequest, NextResponse } from 'next/server';
import { Collection, ObjectId } from 'mongodb';

import clientPromise from './mongodb';

import { Product } from '@/app/products/products.interface';
import { Cart } from '@/app/cart/cart.interface';
import { User } from '@/app/user.interface';

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
    .db(process.env.mongodb_database)
    .collection<CollectionType<T>>(collectionName);
};

export async function getApiUtil(
  request: NextRequest,
  collectionName: CollectionName
) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const priceForProducts = url.searchParams.get('priceForProducts')?.split(',');
  const objectIds = priceForProducts?.map((id) => new ObjectId(id));

  try {
    const collection = await getCollection(collectionName);
    let result;

    if (id) {
      if (collectionName === 'cart') {
        result = await collection.findOne({ userId: id });
      } else {
        result = await collection.findOne({ _id: new ObjectId(id) });
      }
      result = result ? [result] : [];
    } else if (priceForProducts && collectionName === 'products') {
      result = await collection.find({ _id: { $in: objectIds } }).toArray();
    } else {
      result = await collection.find({}).toArray();
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch data from ${collectionName}` },
      { status: 500 }
    );
  }
}

export async function postApiUtil(
  request: NextRequest,
  collectionName: CollectionName
) {
  try {
    const body = await request.json();
    const collection = await getCollection(collectionName);
    const result = await collection.insertOne(body);

    return NextResponse.json(
      { acknowledged: result.acknowledged },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to insert data' },
      { status: 500 }
    );
  }
}

export async function putApiUtil(
  request: NextRequest,
  collectionName: CollectionName
) {
  try {
    const body = await request.json();
    const collection = await getCollection(collectionName);
    const result = await collection.updateOne(
      { userId: body.userId },
      { $set: { items: body.items } }
    );

    return NextResponse.json(
      { acknowledged: result.acknowledged },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

export async function deleteApiUtil(
  request: NextRequest,
  collectionName: CollectionName
) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const productId = url.searchParams.get('productId');

    if (!id || !productId) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const collection = await getCollection(collectionName);
    let result;

    if (productId) {
      result = await collection.updateOne(
        { userId: id },
        { $pull: { items: { productId: productId } } }
      );

      return NextResponse.json(
        {
          success: result.acknowledged && result.modifiedCount > 0,
          message:
            result.modifiedCount > 0
              ? 'Item removed successfully'
              : 'No item removed',
        },
        { status: 200 }
      );
    } else {
      result = await collection.deleteOne({ _id: new ObjectId(id) });

      return NextResponse.json(
        {
          success: result.acknowledged && result.deletedCount > 0,
          message:
            result.deletedCount > 0
              ? 'Item removed successfully'
              : 'No item removed',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
