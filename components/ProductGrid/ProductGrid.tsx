import { getProducts } from "@/lib/products";
import Card from "../Card";
import EmptyState from "./EmptyState";

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
				const defaultImage = product.images?.[0]?.url;

				return (
					<Card
						key={product.id}
						id={product.id}
						title={product.name}
						category={product.category}
						priceMin={parseFloat(`${product.priceMin}`)}
						priceMax={parseFloat(`${product.priceMax}`)}
						image={defaultImage ?? "/placeholder.png"}
					/>
				);
			})}
		</div>
	);
}

export default ProductGrid;
