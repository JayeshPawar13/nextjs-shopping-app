import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  let client;
  const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.2w6mj.mongodb.net/${process.env.mongodb_database}`;
  console.log("here");
  try {
    client = await MongoClient.connect(connectionString);
    return client;
  } catch (error) {
    new Response(
      JSON.stringify({ error: "Failed to establish connection to database" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
