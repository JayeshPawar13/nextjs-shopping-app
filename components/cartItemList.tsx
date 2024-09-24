'use client';

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Spinner } from '@nextui-org/spinner';
import Image from 'next/image';
import { Suspense, useEffect, useMemo, useState } from 'react';

import { Product } from '@/app/products/products.interface';
import { useAppContext } from '@/app/providers';
import CartActions from '@/components/cartActions';

export default function CartListItems() {
  const { cart, setCart } = useAppContext();
  const { products } = useAppContext();
  const { user } = useAppContext();
  const [total, setTotal] = useState(0);

  console.log('outside');

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();

    console.log('memo');

    products.forEach((product) => map.set(product._id.toString(), product));

    return map;
  }, [products]);

  useEffect(() => {
    if (cart && productMap.size > 0) {
      const newTotal = cart.items.reduce((acc, item) => {
        const productPrice =
          productMap.get(item.productId.toString())?.price || 0;

        return acc + +productPrice * item.quantity;
      }, 0);

      setTotal(newTotal);
    }
  }, [cart, productMap]);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`, {
        cache: 'no-store',
      });
      const cartResp = await response.json();

      setCart(cartResp[0]);
    };

    fetchCart();
  }, [setCart]);

  return (
    <>
      {productMap.size > 0 && user && cart && (
        <>
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold">Cart</h1>
          </div>
          <div className="max-w-2xl mx-auto mt-8 p-4">
            {cart.items.length > 0 ? (
              <>
                <Suspense fallback={<Spinner />}>
                  {cart.items.map((item, index) => {
                    const product = productMap.get(item.productId.toString());

                    return (
                      <div key={item.productId.toString()}>
                        <Card
                          isBlurred
                          className="mb-4 bg-white/70 dark:bg-default-100/60 border-none shadow-md rounded-lg"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex justify-between gap-4 mt-2">
                                <Image
                                  alt={product?.name || 'Product Image'}
                                  className="rounded-lg"
                                  height={64}
                                  src={`/images/${product?.image}`}
                                  width={64}
                                />
                                <div>
                                  <p className="font-semibold">
                                    {product?.name}
                                  </p>
                                  <p>Price: ₹{product?.price}</p>
                                  <p>Quantity: {item.quantity}</p>
                                </div>
                              </div>
                              {product && (
                                <CartActions
                                  product={product}
                                  handleSetCart={setCart}
                                />
                              )}
                            </div>
                          </div>
                        </Card>
                        {index === cart.items.length - 1 && (
                          <div className="flex justify-between items-center mt-4 p-4 bg-gradient-to-r from-blue-500 to-teal-800 rounded-lg shadow-lg">
                            <h3 className="text-white text-lg font-bold">
                              Total: <span className="text-2xl">₹{total}</span>
                            </h3>
                            <Button
                              className="text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                              color="success"
                              disabled={cart.items.length === 0}
                            >
                              Proceed to Checkout
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Suspense>
              </>
            ) : (
              <p className="text-center text-lg">Your cart is empty.</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
