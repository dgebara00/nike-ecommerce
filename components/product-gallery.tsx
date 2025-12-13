"use client";

import { useMemo } from "react";

import type { Product } from "@/db/schema";
import { ProductCard } from "./product-card";
import { useProductFilters, type SortOption } from "@/stores/useProductFilters";

const sortByPrice = (a: Product, b: Product) => Number(a.price) - Number(b.price);

export function ProductGallery({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const { query, category, sort, setCategory, setQuery, setSort, reset } = useProductFilters();

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    let result = products.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesQuery = normalizedQuery
        ? [product.name, product.description, product.slug]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesCategory && matchesQuery;
    });

    if (sort === "price-asc") {
      result = [...result].sort(sortByPrice);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => sortByPrice(b, a));
    }

    return result;
  }, [products, query, category, sort]);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-zinc-100/40 bg-white/70 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/15 dark:bg-black/40">
        <input
          type="text"
          placeholder="Search Nike drops"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 min-w-[220px] rounded-2xl border border-transparent bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-900 focus:bg-white dark:bg-zinc-900 dark:text-white"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === null
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
            }`}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-white"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>

        <button
          onClick={reset}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:border-white"
        >
          Reset
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 px-6 py-12 text-center text-zinc-500 dark:border-white/30 dark:bg-zinc-900/40">
          No Nike products match that filter yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
