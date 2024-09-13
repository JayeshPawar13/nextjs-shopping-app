async function getProduct(id: string) {
  const products = await fetch(`${process.env.BASE_URL}/api/products?id=${id}`);

  return products.json();
}

export default async function Product({
  params,
}: {
  params: { slug: string };
}) {
  const products = await getProduct(params.slug);

  return <h1>Product {products[0].name}</h1>;
}
