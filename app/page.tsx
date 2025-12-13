import { ProductGallery } from "@/components/product-gallery";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen space-y-16 bg-[radial-gradient(circle_at_top,_rgba(255,146,43,0.18),_transparent_60%),radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.3),_transparent_50%),#050505] px-4 py-12 text-zinc-50 sm:px-8">
      <section className="mx-auto max-w-6xl rounded-[40px] border border-white/10 bg-gradient-to-br from-orange-500/50 via-zinc-900/60 to-black p-10 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-200">Nike Lab</p>
            <h1 className="text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
              Engineered drops for runners, hoopers, and heavy lifters.
            </h1>
            <p className="text-lg text-orange-50/80">
              Powered by Neon PostgreSQL + Drizzle ORM so merch, pricing, and availability stay
              perfectly in sync across every Nike touchpoint.
            </p>
            <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <span>Real-time stock</span>
              <span>Dynamic pricing</span>
              <span>Resilient auth</span>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap gap-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Nike styles</p>
              <p className="text-4xl font-semibold">{products.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Fulfillment SLA</p>
              <p className="text-4xl font-semibold"><span className="text-orange-300">12</span> hrs</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Top category</p>
              <p className="text-3xl font-semibold">Running</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-200">Inventory</p>
            <h2 className="text-3xl font-semibold text-white">Explore Nike footwear</h2>
          </div>
          <p className="max-w-sm text-right text-sm text-white/70">
            Use the live filters powered by Zustand to slice the catalog straight from Neon via
            Drizzle ORM.
          </p>
        </div>
        <ProductGallery products={products} />
      </section>
    </div>
  );
}
