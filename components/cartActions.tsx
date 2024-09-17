"use client";
import { Button, ButtonGroup } from "@nextui-org/react";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ObjectId } from "mongodb";

import { Cart } from "@/app/cart.interface";
import { User } from "@/app/user.interface";
import { Product } from "@/app/products/products.interface";

interface CartActionsProps {
  product: Product;
  hideDelete?: boolean;
}

export default function CartActions({
  product,
  hideDelete = false,
}: CartActionsProps) {
  const [cart, setCart] = useState<Cart>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    const response = await fetch(`/api/user?id=66e5e9e5f1bb7da2963ec428`);
    const userResp = await response.json();

    setUser(userResp[0]);
  };

  const fetchCart = async () => {
    const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`);
    const cartResp = await response.json();

    setCart(cartResp[0]);
  };

  const addToCartHandler = async (obj: Cart) => {
    const response = await fetch(`/api/cart?id=${user?._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const cartResp = await response.json();

    if (cartResp) setCart(obj);
    setLoading(false);
  };

  const updateCartHandler = async (obj: Cart) => {
    const response = await fetch(`/api/cart?id=${user?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const cartResp = await response.json();

    setLoading(false);
    if (cartResp) setCart(obj);
  };

  const deleteCartHandler = async (
    obj: Cart,
    deleteObj: { productId: ObjectId | string; quantity: number }
  ) => {
    const response = await fetch(
      `/api/cart?id=${user?._id}&productId=${deleteObj.productId}`,
      {
        method: "DELETE",
      }
    );
    const cartResp = await response.json();

    setLoading(false);
    if (cartResp) setCart(obj);
  };

  const modifyCart = (operation: "add" | "remove" | "delete") => {
    setLoading(true);
    let cartObj = cart;

    if (user && product) {
      if (cart) {
        cartObj = { ...cart };
        const item = cartObj.items.find(
          (item) => item.productId === product._id
        );

        if (item) {
          if (operation === "add") {
            item.quantity += 1;
          } else if (operation === "remove") {
            item.quantity -= 1;
          } else {
            cartObj.items = cartObj.items.filter(
              (item) => item.productId !== product._id
            );
            deleteCartHandler(cartObj, item);

            return;
          }
        } else {
          cartObj.items.push({ productId: product._id, quantity: 1 });
        }
        updateCartHandler(cartObj);
      } else {
        cartObj = {
          userId: user._id,
          items: [{ productId: product._id, quantity: 1 }],
        };
        addToCartHandler(cartObj);
      }
    }
  };

  const checkIfProductInCart = () => {
    if (cart) {
      const item = cart.items.find((item) => item.productId === product._id);

      return !!item;
    }

    return false;
  };

  const getProductLengthFromCart = () => {
    if (cart) {
      return (
        cart.items.find((item) => item.productId === product._id)?.quantity || 0
      );
    }

    return 0;
  };

  useEffect(() => {
    fetchUser();
    fetchCart();
  }, []);

  return (
    <div className="flex justify-center">
      {checkIfProductInCart() ? (
        <ButtonGroup>
          {getProductLengthFromCart() <= 1 && hideDelete ? (
            <Button
              className="font-bold py-2 px-4"
              color="danger"
              radius="full"
              size="sm"
              startContent={<MdDeleteOutline />}
              variant="bordered"
              onClick={(e) => {
                modifyCart("delete");
                e.preventDefault();
              }}
            />
          ) : (
            !hideDelete && (
              <Button
                className="font-bold py-2 px-4"
                color="danger"
                radius="full"
                size="sm"
                startContent={<MdDeleteOutline />}
                variant="bordered"
                onClick={(e) => {
                  modifyCart("delete");
                  e.preventDefault();
                }}
              />
            )
          )}

          {getProductLengthFromCart() > 1 && (
            <Button
              className="font-bold py-2 px-4"
              color="primary"
              radius="full"
              size="sm"
              startContent={<AiOutlineMinus />}
              onClick={(e) => {
                modifyCart("remove");
                e.preventDefault();
              }}
            />
          )}
          <Button
            className="font-bold py-2 px-4 pointer-events-none"
            color="primary"
            radius="full"
            size="sm"
          >
            {getProductLengthFromCart()}
          </Button>
          <Button
            className="font-bold py-2 px-4"
            color="primary"
            radius="full"
            size="sm"
            startContent={<AiOutlinePlus />}
            onClick={(e) => {
              modifyCart("add");
              e.preventDefault();
            }}
          />
        </ButtonGroup>
      ) : (
        <Button
          className="font-bold py-2 px-4"
          color="primary"
          endContent={
            <Image
              alt="cart image"
              height={18}
              priority={true}
              src="/icons/cart.svg"
              width={18}
            />
          }
          isLoading={loading}
          radius="full"
          size="sm"
          onClick={(e) => {
            modifyCart("add");
            e.preventDefault();
          }}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
}
