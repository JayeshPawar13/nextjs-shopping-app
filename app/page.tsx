import Image from 'next/image';
import Link from 'next/link';

import { Product } from './products/products.interface';

import { getProducts } from '@/lib/utils';
import { title } from '@/components/primitives';

export default async function Home() {
  const products = await getProducts();

  const getRandomFloatStyle = () => {
    const randomDuration = (Math.random() * 3 + 2).toFixed(2);

    return {
      animation: `float ${randomDuration}s ease-in-out infinite`,
    };
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className={title() + 'text-center mb-10'}>Elevate Your Everyday</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product, index: number) => {
          const dimensions =
            index === 1
              ? { width: 250, height: 240 }
              : { width: 200, height: 200 };

          return (
            <Link
              key={product._id.toString()}
              href={`/products/${product._id}`}
            >
              <div
                className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-2xl transition-shadow duration-500 ease-in-out"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  ...getRandomFloatStyle(),
                }}
              >
                <Image
                  alt={product.name}
                  className="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-125"
                  height={dimensions.height}
                  src={`/images/${product.image}`}
                  width={dimensions.width}
                  quality={75}
                  placeholder="blur"
                  blurDataURL={`/images/${product.image}?w=10&q=10`}
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
