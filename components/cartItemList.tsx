"use client";

import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Spinner } from "@nextui-org/spinner";
import { Suspense, useEffect, useState, useMemo } from "react";

import CartActions from "@/components/cartActions";
import { Product } from "@/app/products/products.interface";
import { User } from "@/app/user.interface";
import { Cart } from "@/app/cart/cart.interface";

export default function CartListItems({
  cart,
  products,
  user,
}: {
  cart?: Cart;
  products: Product[];
  user: User;
}) {
  const [cartItems, setCartItems] = useState<Cart | undefined>(cart);
  const [total, setTotal] = useState(0);

  console.log("outside");

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    console.log("memo");

    products.forEach((product) => map.set(product._id.toString(), product));

    return map;
  }, [products]);

  useEffect(() => {
    if (cartItems && productMap.size > 0) {
      const newTotal = cartItems.items.reduce((acc, item) => {
        const productPrice =
          productMap.get(item.productId.toString())?.price || 0;

        return acc + +productPrice * item.quantity;
      }, 0);

      setTotal(newTotal);
    }
  }, [cartItems, productMap]);

  const fetchCart = async () => {
    const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`, {
      cache: "no-store",
    });
    const cartResp = await response.json();

    setCartItems(cartResp[0]);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      {productMap.size > 0 && user && cartItems && (
        <>
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold">Cart</h1>
          </div>
          <div className="max-w-2xl mx-auto mt-8 p-4">
            {cartItems.items.length > 0 ? (
              <>
                <Suspense fallback={<Spinner />}>
                  {cartItems.items.map((item, index) => {
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
                                  alt={product?.name || "Product Image"}
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
                                  userInp={user}
                                  cartInp={cartItems}
                                  handleSetCart={setCartItems}
                                />
                              )}
                            </div>
                          </div>
                        </Card>
                        {index === cartItems.items.length - 1 && (
                          <div className="flex justify-between items-center mt-4 p-4 bg-gradient-to-r from-blue-500 to-teal-800 rounded-lg shadow-lg">
                            <h3 className="text-white text-lg font-bold">
                              Total: <span className="text-2xl">₹{total}</span>
                            </h3>
                            <Button
                              className="text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                              color="success"
                              disabled={cartItems.items.length === 0}
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
