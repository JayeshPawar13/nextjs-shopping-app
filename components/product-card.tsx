'use client';
import { Card, CardHeader } from '@nextui-org/card';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import CartActions from './cartActions';
import Rating from './rating';

import { Product } from '@/app/products/products.interface';
import { useAppContext } from '@/app/providers';
import { User } from '@/app/user.interface';

const ProductList = ({
  productsData,
  userData,
}: {
  productsData: Product[];
  userData?: User;
}) => {
  const { cart, setCart } = useAppContext();
  const { products, setProducts } = useAppContext();
  const { setUser } = useAppContext();

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`);
      const cartResp = await response.json();

      setCart(cartResp[0]);
    };

    fetchCart();
    setProducts(productsData);
    setUser(userData);
  }, [productsData, userData, setCart, setProducts, setUser]);

  return (
    <>
      {products && products.length > 0 && (
        <div className="flex flex-wrap gap-8 px-8">
          {products.map((product) => (
            <Link
              key={product._id.toString() + 'link'}
              href={`/products/${product._id}`}
              prefetch={true}
            >
              <Card
                key={product._id.toString() + 'card'}
                isFooterBlurred
                isHoverable
                className="w-[300px] h-[300px] flex flex-col relative transform transition-transform duration-300 hover:scale-110"
              >
                <CardHeader className="absolute z-10 top-0 flex-col items-start p-2">
                  {product.isNew ? 'New' : null}
                </CardHeader>
                <Image
                  key={product._id.toString() + 'image'}
                  alt="Card background"
                  className="z-0 w-full h-full scale-125 -translate-y-6 object-cover transform transition-transform duration-300 hover:scale-150"
                  height={200}
                  src={`/images/${product.image}`}
                  width={300}
                />
                <div className="absolute bottom-0 w-full bg-white/80 border-t border-zinc-100/50 z-10  p-2">
                  <span className="text-tiny text-black/60 uppercase font-bold">
                    {product.brand} <Rating value={product.rating} />
                  </span>
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-black font-medium text-lg">
                        {product.name}
                      </h5>
                      <p className="text-black text-sm">₹{product.price}</p>
                    </div>
                    {cart && (
                      <CartActions product={product} hideDelete={true} />
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductList;
