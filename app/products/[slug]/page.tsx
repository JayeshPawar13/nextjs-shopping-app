"use client";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { useEffect, useState } from "react";

import { Product } from "../products.interface";

import Rating from "@/components/rating";
import { User } from "@/app/user.interface";
import { Cart } from "@/app/cart.interface";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product>();
  const [cart, setCart] = useState<Cart>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProduct = async () => {
    const response = await fetch(`/api/products?id=${params.slug}`);
    const productResp = await response.json();

    setProduct(productResp[0]);

    console.log(productResp);
  };

  const fetchUser = async () => {
    const response = await fetch(`/api/user?id=66e5e9e5f1bb7da2963ec428`);
    const userResp = await response.json();

    setUser(userResp[0]);

    console.log(user);
  };

  const fetchCart = async () => {
    const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`);
    const cartResp = await response.json();

    setCart(cartResp[0]);

    console.log(cart);
  };

  const addToCartHandler = async (obj: Cart) => {
    const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const cartResp = await response.json();

    if (cartResp) setCart(obj);
    setLoading(false);
    console.log(cart);
  };

  const updateCartHandler = async (obj: Cart) => {
    const response = await fetch(`/api/cart?id=66e5e9e5f1bb7da2963ec428`, {
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

  const AddToCart = () => {
    setLoading(true);
    let cartObj = cart;

    console.log(product, user);

    if (user && product) {
      if (cart) {
        cartObj = { ...cart };

        if (cartObj.items) {
          const item = cartObj.items.find(
            (item) => item.productId === product._id
          );

          if (item) {
            item.quantity += 1;
          } else {
            cartObj.items.push({ productId: product._id, quantity: 1 });
          }
        } else {
          cartObj.items = [{ productId: product._id, quantity: 1 }];
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
    console.log(cartObj);
  };

  useEffect(() => {
    fetchProduct();
    fetchUser();
    fetchCart();
  }, [params]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8 rounded-large min-h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            <Card className="w-fit ml-auto mr-auto">
              {product ? (
                <Image
                  alt={product?.name ? product.name : "Product Image"}
                  className="object-cover"
                  height={500}
                  src={`/images/${product?.image}`}
                  width={500}
                />
              ) : (
                <Spinner />
              )}
            </Card>
            <div className="flex -mx-2 mb-4 pt-4">
              <div className="w-1/2 px-2">
                <Button
                  className="w-full font-bold py-2 px-4 text-800 transform transition-transform duration-300 hover:scale-110"
                  color="primary"
                  radius="full"
                  size="lg"
                  onClick={() => console.log("Add to wishlist")}
                >
                  Add to Wishlist
                </Button>
              </div>
              <div className="w-1/2 px-2 flex justify-center">
                <Button
                  className="w-full font-bold py-2 px-4 text-800 transform transition-transform duration-300 hover:scale-110"
                  color="primary"
                  isLoading={loading}
                  radius="full"
                  size="lg"
                  onClick={AddToCart}
                >
                  Add to Cart
                  <Image
                    alt="cart image"
                    height={18}
                    priority={true}
                    src="/icons/cart.svg"
                    width={18}
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {product?.description}
            </p>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Price:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  ${product?.price}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Rating:
                  <Rating value={product?.rating ? product.rating : 0} />
                </span>
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Select Color:
              </span>
              <div className="flex items-center mt-2">
                <button className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 mr-2" />
                <button className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-700 mr-2" />
                <button className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-700 mr-2" />
                <button className="w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-700 mr-2" />
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Select Size:
              </span>
              <div className="flex items-center mt-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Product Description:
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {product?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
