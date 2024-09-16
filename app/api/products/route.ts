import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const priceForProducts = url.searchParams.get("priceForProducts")?.split(",");
  const objectIds = priceForProducts?.map((id) => new ObjectId(id));
  console.log(priceForProducts, objectIds);

  const client = await clientPromise;
  const collection = (client as MongoClient)
    ?.db(process.env.mongodb_database)
    .collection("products");
  let products;

  if (id && !priceForProducts) {
    products = await collection?.findOne({ _id: new ObjectId(id) });
    products = new Array(products);
  } else {
    if (priceForProducts) {
      products = await collection?.find({ _id: { $in: objectIds } }).toArray();
      console.log(products);
    } else {
      products = await collection?.find({}).toArray();
    }
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
