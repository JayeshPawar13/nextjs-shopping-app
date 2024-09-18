import { title } from "@/components/primitives";
import ProductCard from "@/components/product-card";
import { getProducts, getUsers } from "@/lib/utils";

export default async function ProductsPage() {
  const [products, user] = await Promise.all([getProducts(), getUsers()]);

  if (!products) throw new Error("Products not found");

  return (
    <>
      <div className="flex justify-center">
        <h1 className={title()}>Products</h1>
      </div>

      <div className="mt-4">
        <ProductCard
          products={JSON.parse(JSON.stringify(products))}
          user={JSON.parse(JSON.stringify(user))}
        />
      </div>
    </>
  );
}
