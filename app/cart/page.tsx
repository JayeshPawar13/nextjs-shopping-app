"use client";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { Spacer } from "@nextui-org/spacer";
import { ObjectId } from "mongodb";
import Image from "next/image";
import { title } from "@/components/primitives";
import { Cart } from "../cart.interface";
import { User } from "../user.interface";
import { Product } from "../products/products.interface";

const CartItem = ({
  item,
  product,
  onRemove,
}: {
  item: {
    productId: ObjectId | string;
    quantity: number;
  };
  product: Product | undefined;
  onRemove: Function;
}) => {
  console.log(item, product);

  return (
    <Card className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex justify-between gap-4 mt-2">
            <Image
              alt={product?.name ? product.name : "Product Image"}
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
          <Button className="text-xs" onClick={() => onRemove()}>
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart>();
  const [cartProducts, setCartProducts] = useState<Map<string, Product>>();
  const fetchCart = async () => {
    const cartResponse = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`);
    const cartResp = await cartResponse.json();
    const priceForProducts = cartResp[0]?.items
      .map((item: { productId: string; quantity: number }) => item.productId)
      .join(",");
    const prodResponse = await fetch(
      `/api/products?id=66e5e9e5f1bb7da2963ec428&priceForProducts=${priceForProducts}`
    );
    const prodResp: Product[] = await prodResponse.json();

    setCart(cartResp[0]);

    const productMap = new Map<string, Product>();

    prodResp.forEach((product) =>
      productMap.set(product._id.toString(), product)
    );

    setCartProducts(productMap);
  };

  const deleteCartHandler = async (obj: Cart, productId: string) => {
    const response = await fetch(
      `/api/cart?id=66e5e9e5f1bb7da2963ec428&productId=${productId}`,
      {
        method: "DELETE",
      }
    );
    const cartResp = await response.json();

    if (cartResp) setCart(obj);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = (productId: string) => {
    // setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

    if (cart) {
      const cartObj = { ...cart };

      cartObj.items = cartObj.items.filter(
        (item) => item.productId !== productId
      );
      deleteCartHandler(cartObj, productId);
    }
  };

  const total = cart?.items.reduce(
    (acc, item) =>
      acc +
      Number(cartProducts?.get(item.productId.toString())?.price) *
        item.quantity,
    0
  );

  return (
    <>
      <div className="flex justify-center">
        <h1 className={title()}>Cart</h1>
      </div>
      <div className="max-w-2xl mx-auto mt-8 p-4">
        {cart && cartProducts ? (
          cart?.items.length > 0 ? (
            cart?.items.map((item) => (
              <CartItem
                key={item.productId.toString()}
                item={item}
                product={cartProducts?.get(item.productId.toString())}
                onRemove={() => removeItem(item.productId.toString())}
              />
            ))
          ) : (
            <p className="text-center text-lg">Your cart is empty.</p>
          )
        ) : null}

        <Spacer y={2} />
        <div className="flex justify-between items-center">
          <h3>Total: ₹{total}</h3>
          <Button
            className="text-lg"
            color="success"
            disabled={cart?.items.length === 0}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
