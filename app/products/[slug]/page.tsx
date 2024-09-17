import Image from "next/image";
import { Card } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

import { Product } from "../products.interface";

import Rating from "@/components/rating";
import CartActions from "@/components/cartActions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getProducts(slug: string) {
  const client = await clientPromise;
  const collection = client
    .db(process.env.mongodb_database)
    .collection<Product>("products");

  return await collection?.findOne({ _id: new ObjectId(slug) });
}
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const productResp = await getProducts(slug);

  const product: Product | null = productResp || null;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8 rounded-large min-h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            <Card className="w-fit ml-auto mr-auto">
              {product ? (
                <Image
                  alt={product?.name ? product.name : "Product Image"}
                  className="object-cover"
                  height={500}
                  src={`/images/${product?.image}`}
                  width={500}
                />
              ) : (
                <Spinner />
              )}
            </Card>
            <div className="flex -mx-2 mb-4 pt-4 justify-center">
              {product && <CartActions product={product} />}
            </div>
          </div>

          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {product?.description}
            </p>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Price:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  ${product?.price}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Rating:
                  <Rating value={product?.rating ? product.rating : 0} />
                </span>
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Select Color:
              </span>
              <div className="flex items-center mt-2">
                <button className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 mr-2" />
                <button className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-700 mr-2" />
                <button className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-700 mr-2" />
                <button className="w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-700 mr-2" />
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Select Size:
              </span>
              <div className="flex items-center mt-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Product Description:
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {product?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
