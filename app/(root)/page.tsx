import { Suspense } from "react";

import ProductGrid, { type SearchParams, ProductsLoading } from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";
import { getAllFilterOptions } from "@/lib/filters";
import FilterGroup from "@/components/FilterGroup";
import Sort from "@/components/Sort";

type Props = {
	searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: Props) {
	const [resolvedSearchParams, filterOptions, allProducts] = await Promise.all([
		searchParams,
		getAllFilterOptions(),
		getProducts(),
	]);

	const filters = [
		{
			key: "gender",
			label: "Gender",
			options: filterOptions.genders,
			defaultExpanded: true,
		},
		{
			key: "category",
			label: "Category",
			options: filterOptions.categories,
			defaultExpanded: true,
		},
		{
			key: "price",
			label: "Shop By Price",
			options: filterOptions.priceRanges,
			defaultExpanded: true,
		},
	];

	return (
		<main className="min-h-screen bg-light-100">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-6 flex items-center justify-between lg:hidden">
					<h1 className="text-heading-3 font-heading-3 text-dark-900">New ({allProducts.total})</h1>
					<div className="flex items-center gap-4">
						<Suspense fallback={null}>
							<FilterGroup filters={filters} totalProducts={allProducts.total} />
						</Suspense>
						<Suspense fallback={null}>
							<Sort />
						</Suspense>
					</div>
				</div>

				<div className="flex gap-8">
					<div className="hidden lg:block">
						<Suspense fallback={null}>
							<FilterGroup filters={filters} totalProducts={allProducts.total} />
						</Suspense>
					</div>

					<div className="flex-1">
						<div className="mb-6 hidden items-center justify-end lg:flex">
							<Suspense fallback={null}>
								<Sort />
							</Suspense>
						</div>

						<Suspense fallback={<ProductsLoading />}>
							<ProductGrid searchParams={resolvedSearchParams} />
						</Suspense>
					</div>
				</div>
			</div>
		</main>
	);
}
