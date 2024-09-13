import { Product } from "./products.interface";

import { title } from "@/components/primitives";
import ProductCard from "@/components/product-card";
async function getProducts() {
  const products = await fetch("http://localhost:3000/api/products");

  return products.json();
}
export default async function ProductsPage() {
  const products: Product[] = await getProducts();

  return (
    <>
      <h1 className={title()}>Products</h1>
      <div className="mt-4">
        <ProductCard products={products} />
      </div>
    </>
  );
}
