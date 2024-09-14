import { MongoClient } from "mongodb";

declare global {
  // Global is used to preserve the client across hot reloads in development.
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri: string = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.2w6mj.mongodb.net/${process.env.mongodb_database}`;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is preserved across hot reloads.
  console.log("here 1");

  if (!global._mongoClientPromise) {
    console.log("here 2");

    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
