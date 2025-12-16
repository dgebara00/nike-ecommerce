import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { getAllFilterOptions } from "@/lib/filters";
import Card from "@/components/Card";
import FilterGroup from "@/components/FilterGroup";
import Sort from "@/components/Sort";

interface SearchParams {
  gender?: string;
  category?: string;
  price?: string;
  sort?: string;
}

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

function ProductsLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-light-200"
          style={{ aspectRatio: "1/1.3" }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-light-200 p-6">
        <svg
          className="h-12 w-12 text-dark-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-heading-3 font-heading-3 text-dark-900">
        No products found
      </h3>
      <p className="max-w-md text-body font-body text-dark-700">
        We couldn&apos;t find any products matching your filters. Try adjusting your
        selection or clearing all filters to see more options.
      </p>
    </div>
  );
}

async function ProductGrid({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = {
    gender: searchParams.gender?.split(",").filter(Boolean),
    category: searchParams.category?.split(",").filter(Boolean),
    price: searchParams.price?.split(",").filter(Boolean),
    sort: searchParams.sort,
  };

  const products = await getProducts(filters);

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const defaultVariant = product.variants.find(
          (variant) => variant.id === product.defaultVariantId
        );
        const priceValue = Number.parseFloat(`${defaultVariant?.price || 0}`);
        const defaultVariantImage = product.images[0];

        return (
          <Card
            key={product.id}
            id={product.id}
            title={product.name}
            category={product?.category?.name as string}
            price={Number.isNaN(priceValue) ? 0 : priceValue}
            image={defaultVariantImage?.url || "/placeholder.png"}
            colorCount={defaultVariant?.inStock}
          />
        );
      })}
    </div>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const filterOptions = await getAllFilterOptions();

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

  const allProducts = await getProducts();
  const totalProducts = allProducts.length;

  return (
    <main className="min-h-screen bg-light-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <h1 className="text-heading-3 font-heading-3 text-dark-900">
            New ({totalProducts})
          </h1>
          <div className="flex items-center gap-4">
            <Suspense fallback={null}>
              <FilterGroup
                filters={filters}
                totalProducts={totalProducts}
              />
            </Suspense>
            <Suspense fallback={null}>
              <Sort />
            </Suspense>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block">
            <Suspense fallback={null}>
              <FilterGroup
                filters={filters}
                totalProducts={totalProducts}
              />
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
