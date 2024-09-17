"use client";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Spinner } from "@nextui-org/spinner";
import { Suspense, useEffect, useState } from "react";

import CartActions from "@/components/cartActions";
import { Product } from "@/app/products/products.interface";
import { User } from "@/app/user.interface";
import { Cart } from "@/app/cart.interface";

export default function CartListItems({
  cart,
  products,
  user,
}: {
  cart?: Cart;
  products: Product[];
  user: User;
}) {
  const [cartItems, setCartItems] = useState(cart);
  const [total, setTotal] = useState(0);

  const productMap = new Map<string, Product>();

  products.forEach((product) =>
    productMap.set(product._id.toString(), product)
  );

  const handleSetCart = (updatedCart: Cart) => {
    setCartItems(updatedCart);

    if (cartItems && productMap.size > 0) {
      const newTotal = cartItems.items.reduce((acc, item) => {
        const productPrice =
          productMap.get(item.productId.toString())?.price || 0;

        return acc + productPrice * item.quantity;
      }, 0);

      setTotal(newTotal);
    }
  };

  const fetchCart = async () => {
    const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`, {
      cache: "no-store",
    });
    const cartResp = await response.json();

    setCartItems(cartResp[0]);
    const newTotal = cartResp[0].items.reduce((acc, item) => {
      const productPrice =
        productMap.get(item.productId.toString())?.price || 0;

      return acc + productPrice * item.quantity;
    }, 0);
    setTotal(newTotal);

    if (handleSetCart) handleSetCart(cartResp[0]);
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
              cartItems.items.map((item, index) => {
                const product = productMap.get(item.productId.toString());

                return (
                  <div key={item.productId.toString()}>
                    <Card className="mb-4">
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between gap-4 mt-2">
                            <Image
                              alt={product?.name || "Product Image"}
                              className="object-cover"
                              height={64}
                              src={`/images/${product?.image}`}
                              width={64}
                            />
                            <div>
                              <p>{product?.name}</p>
                              <p>Price: ₹{product?.price}</p>
                              <p>Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <Suspense fallback={<Spinner />}>
                            {product && (
                              <CartActions
                                product={product}
                                userInp={user}
                                cartInp={cartItems}
                                handleSetCart={handleSetCart}
                              />
                            )}
                          </Suspense>
                        </div>
                      </div>
                    </Card>
                    {index === cartItems.items.length - 1 && (
                      <div className="flex justify-between items-center mt-4">
                        <h3>Total: ₹{total}</h3>
                        <Button
                          className="text-lg"
                          color="success"
                          disabled={cartItems.items.length === 0}
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-lg">Your cart is empty.</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
