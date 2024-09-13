"use client";
import { Card, Button, CardHeader } from "@nextui-org/react";
import Image from "next/image"; // Or use <img> if not using Next.js
import Rating from "./rating";
import Link from "next/link";

const ProductList = ({ products }) => {
  console.log(products);

  return (
    <div className="flex flex-wrap gap-8 px-8">
      {products.map((product) => (
        <Link key={product._id} href={`/products/${product._id}`}>
          <Card
            key={product._id}
            isFooterBlurred
            isHoverable
            className="w-[300px] h-[300px] flex flex-col relative transform transition-transform duration-300 hover:scale-110"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start">
              <p className="text-tiny text-black/60 uppercase font-bold">
                {product.isNew ? "New" : null}
              </p>
              <p className="text-tiny text-black/60 uppercase font-bold">
                {product.brand}
              </p>
            </CardHeader>
            <Image
              alt="Card example background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover transform transition-transform duration-300 hover:scale-150"
              src={`/images/${product.image}`}
              width={300}
              height={200}
            />
            <div className="absolute bottom-0 w-full bg-white/80 border-t border-zinc-100/50 z-10 flex justify-between items-center p-2">
              <div>
                <h5 className="text-black font-medium text-lg">
                  {product.name}
                </h5>
                <p className="text-black text-sm">{product.price}</p>
                <Rating value={product.rating} />
              </div>
              <Button
                className="text-xs  transform transition-transform duration-300 hover:scale-110"
                color="primary"
                radius="full"
                size="sm"
              >
                Add to Cart
                <Image
                  src="/icons/cart.svg"
                  width={18}
                  height={18}
                  alt="cart image"
                />
              </Button>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
