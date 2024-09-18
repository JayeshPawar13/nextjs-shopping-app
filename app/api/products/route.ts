import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { Product } from "@/app/products/products.interface";

const getCollection = async () => {
  const client = await clientPromise;

  return (client as MongoClient)
    .db(process.env.mongodb_database)
    .collection<Product>("products");
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const priceForProducts = url.searchParams.get("priceForProducts")?.split(",");
  const objectIds = priceForProducts?.map((id) => new ObjectId(id));

  try {
    const collection = await getCollection();
    let products;

    if (id) {
      products = await collection.findOne({ _id: new ObjectId(id) });
      products = products ? [products] : [];
    } else if (priceForProducts) {
      products = await collection.find({ _id: { $in: objectIds } }).toArray();
    } else {
      products = await collection.find({}).toArray();
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
