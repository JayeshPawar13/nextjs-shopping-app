import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  console.log("in get");

  const client = await clientPromise;
  const collection = (client as MongoClient)
    ?.db(process.env.mongodb_database)
    .collection("cart");
  let cart;

  if (id) {
    cart = await collection?.findOne({ userId: id });
    cart = new Array(cart);
  } else {
    cart = await collection?.find({}).toArray();
  }

  try {
    return NextResponse.json(cart, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log("in post", body);

  const client = await clientPromise;
  const collection = (client as MongoClient)
    ?.db(process.env.mongodb_database)
    .collection("cart");
  let cart;

  cart = (await collection.insertOne(body)).acknowledged;

  try {
    return NextResponse.json(cart, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  console.log("in put", body);

  const client = await clientPromise;
  const collection = (client as MongoClient)
    ?.db(process.env.mongodb_database)
    .collection("cart");
  let cart;

  cart = (
    await collection.updateOne(
      { userId: body.userId },
      { $set: { items: body.items } }
    )
  ).acknowledged;

  try {
    return NextResponse.json(cart, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
  }
}
