import { Suspense } from "react";

import FilteredProductGrid, { type SearchParams, ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";
import { getAllFilterOptions } from "@/lib/filters";
import FilterGroup, { FilterGroupSkeleton } from "@/components/FilterGroup";
import Sort, { SortSkeleton } from "@/components/Sort";

type Props = {
	searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: Props) {
	const [filterOptions, allProducts] = await Promise.all([getAllFilterOptions(), getProducts()]);

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
						<Suspense fallback={<FilterGroupSkeleton />}>
							<FilterGroup filters={filters} totalProducts={allProducts.total} />
						</Suspense>
						<Suspense fallback={<SortSkeleton />}>
							<Sort />
						</Suspense>
					</div>
				</div>

				<div className="flex gap-8">
					<div className="hidden lg:block">
						<Suspense fallback={<FilterGroupSkeleton />}>
							<FilterGroup filters={filters} totalProducts={allProducts.total} />
						</Suspense>
					</div>

					<div className="flex-1">
						<div className="mb-6 hidden items-center justify-end lg:flex">
							<Suspense fallback={<SortSkeleton />}>
								<Sort />
							</Suspense>
						</div>

						<Suspense fallback={<ProductGrid {...allProducts} />}>
							<FilteredProductGrid searchParams={searchParams} />
						</Suspense>
					</div>
				</div>
			</div>
		</main>
	);
}
