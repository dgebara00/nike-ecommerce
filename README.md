## Nike E-Commerce Accelerator

Next.js 14 storefront showcasing a Nike footwear catalog backed by Neon + Drizzle ORM, Better Auth, Tailwind CSS 4, and Zustand client-side filters.

### Stack

- Next.js 14 App Router, TypeScript, React 19
- Tailwind CSS v4 styles with custom gradients
- Drizzle ORM + Neon serverless Postgres driver
- Better Auth + Drizzle adapter for password auth endpoints (`/api/auth/[...better-auth]`)
- Zustand filter store powering the product gallery
- ESLint 9 + Prettier 3 flat config

### Environment Setup

1. Install dependencies
	```bash
	npm install
	```
2. Copy the sample env file and populate credentials
	```bash
	cp .env.example .env.local
	```
	- `DATABASE_URL` – full Neon connection string
	- `BETTER_AUTH_SECRET` – at least 32 chars (`openssl rand -base64 32`)
3. Apply the latest schema and seed Nike inventory
	```bash
	npm run db:push
	npm run db:seed
	```
4. (Optional) Inspect data visually
	```bash
	npm run db:studio
	```
5. Start the dev server
	```bash
	npm run dev
	```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Create a production build (set env vars first) |
| `npm run start` | Run the compiled server |
| `npm run lint` | Run ESLint |
| `npm run format` / `format:write` | Check or fix formatting with Prettier |
| `npm run db:push` | Synchronize Drizzle schema to the database |
| `npm run db:seed` | Reseed products with curated Nike drops |
| `npm run db:studio` | Launch Drizzle Studio for inspection |

### Architecture Notes

- `db/schema.ts` defines the `products` table, types, and defaults.
- `scripts/seed.ts` wipes/reseeds the catalog with curated Nike footwear metadata.
- `lib/products.ts` exposes a safe server-side accessor with graceful fallbacks.
- `stores/useProductFilters.ts` centralizes Zustand filter/search/sort state used by `ProductGallery`.
- `/app/api/auth/[...better-auth]` wires Better Auth to the Drizzle adapter for credential-based flows; client helpers can consume the same endpoint.

### Production Checklist

- Use a Neon project URL with pooled connections.
- Run `npx @better-auth/cli secret` to mint a 32+ char secret for sessions.
- Configure `NEXT_PUBLIC_APP_URL` if deploying somewhere other than `http://localhost:3000`.
- Keep Drizzle migrations in sync via `npm run db:push` or `drizzle-kit generate` before deployment.
