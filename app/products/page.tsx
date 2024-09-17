import { title } from "@/components/primitives";
import ProductCard from "@/components/product-card";
import { getCart, getProducts, getUsers } from "@/lib/utils";

export default async function ProductsPage() {
  const products = await getProducts();
  const user = await getUsers();

  if (!products) throw new Error("Products not found");

  return (
    <>
      <h1 className={title()}>Products</h1>
      <div className="mt-4">
        <ProductCard
          products={JSON.parse(JSON.stringify(products))}
          user={JSON.parse(JSON.stringify(user))}
        />
      </div>
    </>
  );
}
