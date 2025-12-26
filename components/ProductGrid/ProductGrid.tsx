import Link from "next/link";

import Card from "../Card";
import EmptyState from "./EmptyState";
import { getProducts } from "@/lib/products";

export interface SearchParams {
	gender?: string;
	category?: string;
	price?: string;
	sort?: string;
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
	const filters = {
		gender: searchParams.gender?.split(",").filter(Boolean),
		category: searchParams.category?.split(",").filter(Boolean),
		price: searchParams.price?.split(",").filter(Boolean),
		sort: searchParams.sort,
	};

	const { products, total } = await getProducts(filters);

	if (total === 0) {
		return <EmptyState />;
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{products.map(product => {
				const defaultVariant = product.variants.find(v => v.id === product.defaultVariantId) ?? product.variants[0];
				const defaultImage = defaultVariant?.images?.[0]?.url; // first image is always the primary one due to ordering;

				return (
					<Link key={product.id} href={`/products/${product.slug}/${defaultVariant.sku}`}>
						<Card
							key={product.id}
							title={product.name}
							category={product.category}
							priceMin={parseFloat(`${product.priceMin}`)}
							priceMax={parseFloat(`${product.priceMax}`)}
							image={defaultImage ?? "/placeholder.png"}
						/>
					</Link>
				);
			})}
		</div>
	);
}

export default ProductGrid;
