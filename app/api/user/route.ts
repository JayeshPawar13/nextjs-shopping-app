import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { User } from "@/app/user.interface";

const getCollection = async () => {
  const client = await clientPromise;

  return (client as MongoClient)
    .db(process.env.mongodb_user_database)
    .collection<User>("shopping-app-user");
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const collection = await getCollection();
    let user;

    if (id) {
      user = await collection.findOne({ _id: new ObjectId(id) });
      user = user ? [user] : [];
    } else {
      user = await collection.find({}).toArray();
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
