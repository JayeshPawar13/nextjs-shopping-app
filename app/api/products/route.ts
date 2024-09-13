import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const client = await connectToDatabase();
  const collection = (client as MongoClient)?.db().collection("products");
  let products;

  if (id) {
    products = await collection?.findOne({ _id: new ObjectId(id) });
    products = new Array(products);
  } else {
    products = await collection?.find({}).toArray();
  }

  try {
    return NextResponse.json(products, {
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
