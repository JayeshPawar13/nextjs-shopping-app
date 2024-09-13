async function getProduct(id: string) {
  const products = await fetch(`http://localhost:3000/api/products?id=${id}`);

  return products.json();
}

export default async function Product({ params }) {
  const products = await getProduct(params.slug);

  return <h1>Product {products[0].name}</h1>;
}
