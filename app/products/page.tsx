import { Product } from "./products.interface";

import { title } from "@/components/primitives";
import ProductCard from "@/components/product-card";
import clientPromise from "@/lib/mongodb";
async function getProducts() {
  const client = await clientPromise;
  const collection = client.db().collection("products");

  return await collection?.find({}).toArray();
}
export default async function ProductsPage() {
  const products = (await getProducts()) as Product[];

  if (!products) throw new Error("Products not found");

  return (
    <>
      <h1 className={title()}>Products</h1>
      <div className="mt-4">
        <ProductCard products={JSON.parse(JSON.stringify(products))} />
      </div>
    </>
  );
}
