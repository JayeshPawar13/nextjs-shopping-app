import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function connectToDatabase() {
  let client;
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.2w6mj.mongodb.net/${process.env.mongodb_database}`;
  console.log("here");
  try {
    client = await MongoClient.connect(connectionString);
    return client;
  } catch (error) {
    return NextResponse.json({
      error: "Failed to establish connection to database",
      status: 500,
    });
  }
}
