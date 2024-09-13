import Image from "next/image";
import { Product } from "./products/products.interface";

async function getProducts() {
  const products = await fetch(`${process.env.BASE_URL}/api/products`);

  return products.json();
}

export default async function Home() {
  const products: Product[] = await getProducts();

  const getRandomFloatStyle = () => {
    const randomDuration = (Math.random() * 3 + 2).toFixed(2);

    return {
      animation: `float ${randomDuration}s ease-in-out infinite`,
    };
  };

  return (
    <div className="flex justify-around items-center p-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Elevate Your Everyday
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {products.map((image, index) => {
          const isSmall = index % 2 === 0;
          const isElongated = index === 1;

          const width = isSmall ? 150 : isElongated ? 250 : 200;
          const height = isSmall ? 150 : isElongated ? 240 : 200;

          return (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-2xl transition-shadow duration-500 ease-in-out"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                ...getRandomFloatStyle(), // Apply random floating effect
              }}
            >
              <Image
                alt={image.name}
                className="object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-110"
                height={height}
                src={`/images/${image.image}`}
                width={width}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
            </div>
          );
        })}
      </div>

      {/* Tailwind CSS custom floating animation */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
