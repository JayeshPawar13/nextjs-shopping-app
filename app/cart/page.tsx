import { getCart, getProducts, getUsers } from "@/lib/utils";
import CartListItems from "@/components/cartItemList";

export default async function CartPage() {
  const cart = await getCart();
  const products = await getProducts();
  const user = await getUsers();

  return (
    <>
      {cart && products && user && (
        <CartListItems products={products} user={user} />
      )}
    </>
  );
}
