import { NextRequest, NextResponse } from "next/server";

import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const client = await clientPromise;
  const collection = (client as MongoClient)
    ?.db(process.env.mongodb_user_database)
    .collection("shopping-app-user");
  let user;

  if (id) {
    user = await collection?.findOne({ _id: new ObjectId(id) });
    user = new Array(user);
  } else {
    user = await collection?.find({}).toArray();
  }

  try {
    return NextResponse.json(user, {
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
