import { Card, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Image from "next/image"; // Or use <img> if not using Next.js
import Link from "next/link";

import Rating from "./rating";

import { Product } from "@/app/products/products.interface";

const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <div className="flex flex-wrap gap-8 px-8">
      {products.map((product) => (
        <Link
          key={product._id.toString() + "link"}
          href={`/products/${product._id}`}
          prefetch={true}
        >
          <Card
            key={product._id.toString() + "card"}
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
              key={product._id.toString() + "image"}
              alt="Card background"
              className="z-0 w-full h-full scale-125 -translate-y-6 object-cover transform transition-transform duration-300 hover:scale-150"
              height={200}
              src={`/images/${product.image}`}
              width={300}
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
                  alt="cart image"
                  height={18}
                  src="/icons/cart.svg"
                  width={18}
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
