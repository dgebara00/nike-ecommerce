import { Card } from "@/components/Card";

export interface RelatedProductItem {
	id: string;
	slug: string;
	name: string;
	category: string;
	priceMin: number;
	priceMax: number;
	image: string;
	badge?: string;
}

interface RelatedProductsProps {
	products: RelatedProductItem[];
	title?: string;
}

export function RelatedProducts({ products, title = "You Might Also Like" }: RelatedProductsProps) {
	if (products.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="related-products-heading" className="py-12">
			<h2
				id="related-products-heading"
				className="mb-8 text-heading-3 font-heading-3 text-dark-900"
			>
				{title}
			</h2>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product) => (
					<Card
						key={product.id}
						id={product.id}
						title={product.name}
						category={product.category}
						priceMin={product.priceMin}
						priceMax={product.priceMax}
						image={product.image}
						badge={product.badge}
						href={`/products/${product.slug}`}
					/>
				))}
			</div>
		</section>
	);
}

export default RelatedProducts;
