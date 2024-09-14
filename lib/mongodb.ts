import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  let client;
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.2w6mj.mongodb.net/${process.env.mongodb_database}`;

  try {
    client = await MongoClient.connect(connectionString);

    return client;
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}
