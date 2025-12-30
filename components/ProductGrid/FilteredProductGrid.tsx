import Link from "next/link";

import Card from "../Card";
import EmptyProductGrid from "./EmptyProductGrid";
import { getProducts } from "@/lib/products";
import { Product } from "@/lib/products/types";

export type SearchParams = {
	gender?: string;
	category?: string;
	price?: string;
	sort?: string;
};

export const ProductGrid = ({ total, products }: { total: number; products: Product[] }) => {
	if (total === 0) {
		return <EmptyProductGrid />;
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
};

async function FilteredProductGrid({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const resolvedSearchParams = await searchParams;

	const filters = {
		gender: resolvedSearchParams.gender?.split(",").filter(Boolean) ?? [],
		category: resolvedSearchParams.category?.split(",").filter(Boolean) ?? [],
		price: resolvedSearchParams.price?.split(",").filter(Boolean) ?? [],
		sort: resolvedSearchParams.sort,
	};

	const { products, total } = await getProducts(filters);

	return <ProductGrid total={total} products={products} />;
}

export default FilteredProductGrid;
