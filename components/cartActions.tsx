'use client';
import { Button, ButtonGroup } from '@nextui-org/button';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';

import { Cart } from '@/app/cart/cart.interface';
import { Product } from '@/app/products/products.interface';
import { useAppContext } from '@/app/providers';

interface CartActionsProps {
  product: Product;
  hideDelete?: boolean;
  onDelete?: () => void;
  onRemoveFromCart?: () => void;
  onAddToCart?: () => void;
  handleSetCart?: (cart: Cart) => void;
}

export default function CartActions({
  product,
  hideDelete = false,
  onDelete,
  onRemoveFromCart,
  onAddToCart,
  handleSetCart,
}: CartActionsProps) {
  const { cart, setCart } = useAppContext();
  const { user } = useAppContext();

  const updateCartHandler = async (obj: Cart) => {
    const response = await fetch(`/api/cart?id=${user?._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
      cache: 'no-store',
    });
    const cartResp = await response.json();

    if (cartResp) {
      if (onAddToCart) onAddToCart();
      setCart(obj);
      if (handleSetCart) handleSetCart(obj);
    }
  };

  const deleteCartHandler = async (obj: Cart, productId: string) => {
    const response = await fetch(
      `/api/cart?id=${user?._id}&productId=${productId}`,
      {
        method: 'DELETE',
        cache: 'no-store',
      }
    );
    const cartResp = await response.json();

    if (cartResp) {
      setCart(obj);
      if (onDelete) onDelete();
      if (onRemoveFromCart) onRemoveFromCart();
      if (handleSetCart) handleSetCart(obj);
    }
  };

  const modifyCart = (operation: 'add' | 'remove' | 'delete') => {
    if (user && product) {
      let cartObj = cart || {
        userId: user._id,
        items: [{ productId: product._id, quantity: 1 }],
      };

      if (cart) cartObj = { ...cart };
      const item = cartObj.items.find((item) => item.productId === product._id);

      if (item) {
        if (operation === 'add') {
          item.quantity += 1;
        } else if (operation === 'remove') {
          item.quantity -= 1;
        } else {
          cartObj.items = cartObj.items.filter(
            (item) => item.productId !== product._id
          );
          deleteCartHandler(cartObj, product._id.toString());

          return;
        }
      } else {
        cartObj.items.push({ productId: product._id, quantity: 1 });
      }
      updateCartHandler(cartObj);
    }
  };

  const checkIfProductInCart = () => {
    return cart?.items.some((item) => item.productId === product._id);
  };

  const getProductLengthFromCart = () => {
    return (
      cart?.items.find((item) => item.productId === product._id)?.quantity || 0
    );
  };

  return (
    <>
      {cart && user && product && (
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
                    modifyCart('delete');
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
                      modifyCart('delete');
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
                    modifyCart('remove');
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
                  modifyCart('add');
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
              radius="full"
              size="sm"
              onClick={(e) => {
                modifyCart('add');
                e.preventDefault();
              }}
            >
              Add to Cart
            </Button>
          )}
        </div>
      )}
    </>
  );
}
