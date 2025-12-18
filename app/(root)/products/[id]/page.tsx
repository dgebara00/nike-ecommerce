import { getProduct } from "@/lib/products";

export default async function ProductPage({ params }: { params: { id: string } }) {
	const product = await getProduct(params.id);

	if (!product) {
		return <div>Product not found</div>;
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">{product.name}</h1>
			<p className="mb-2">{product.description}</p>
			<p className="font-semibold">Price: ${product.variants[0]?.price || "N/A"}</p>
			{/* Add more product details as needed */}
		</div>
	);
}
