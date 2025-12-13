import Image from "next/image";

import type { Product } from "@/db/schema";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function ProductCard({ product }: { product: Product }) {
  const price = Number(product.price);

  return (
    <article className="group flex flex-col gap-4 rounded-3xl border border-zinc-100/20 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 via-white to-zinc-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-black">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white/20">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-zinc-500">Starting at</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {currencyFormatter.format(price)}
            </p>
          </div>
          <button className="rounded-full border border-zinc-900/10 px-4 py-2 text-sm font-semibold tracking-wide text-zinc-900 transition hover:-translate-y-0.5 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black">
            Add to bag
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Inventory: {product.inventory}</span>
        <span>SKU: {product.slug}</span>
      </div>
    </article>
  );
}
