import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { Cart } from "@/app/cart/cart.interface";

const getCollection = async () => {
  const client = await clientPromise;

  return (client as MongoClient)
    .db(process.env.mongodb_database)
    .collection<Cart>("cart");
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const collection = await getCollection();
    let cart;

    if (id) {
      const result = await collection.findOne({ userId: id });

      cart = result ? [result] : [];
    } else {
      cart = await collection.find({}).toArray();
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await getCollection();
    const result = await collection.insertOne(body);

    return NextResponse.json(
      { acknowledged: result.acknowledged },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await getCollection();
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
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const productId = url.searchParams.get("productId");

    if (!id || !productId) {
      return NextResponse.json(
        { error: "Missing id or productId" },
        { status: 400 }
      );
    }

    const collection = await getCollection();
    const result = await collection.updateOne(
      { userId: id },
      { $pull: { items: { productId: productId } } }
    );

    return NextResponse.json(
      {
        success: result.acknowledged && result.modifiedCount > 0,
        message:
          result.modifiedCount > 0
            ? "Item removed successfully"
            : "No item removed",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
