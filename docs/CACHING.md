# Database Caching Strategy

## Overview

This document explains how the Nike E-Commerce application handles database caching for Drizzle ORM queries with the Neon serverless database, particularly in scenarios with multiple concurrent requests.

## Question / Pytanie

**PL:** Czy Drizzle albo Neon w jakiś sposób handlują cache'a? Jak działają tutaj wielokrotne requesty w krótkim czasie?

**EN:** Do Drizzle or Neon handle caching in some way? How do multiple requests in a short time work here?

## Answer / Odpowiedź

### Built-in Caching Capabilities

#### Neon Database

- **Connection Pooling**: Neon provides connection pooling through the `@neondatabase/serverless` driver using HTTP fetch
- **No Built-in Query Caching**: Neon itself doesn't cache query results - each query hits the database
- **Serverless Optimization**: The HTTP-based driver is optimized for serverless environments with automatic connection management

#### Drizzle ORM

- **No Built-in Caching**: Drizzle ORM is a thin layer over SQL and doesn't provide query result caching
- **Request Deduplication**: Without additional caching, concurrent identical queries will each execute separately
- **Performance**: Drizzle generates efficient SQL, but each call triggers a database round-trip

### Application-Level Caching Solution

To optimize performance and handle multiple concurrent requests efficiently, this application implements **Next.js `unstable_cache`** for request deduplication and result caching.

## Implementation Details

### Products Caching (`lib/products.ts`)

```typescript
const getCachedProducts = unstable_cache(
  async () => {
    return await db.query.products.findMany({
      with: { category: true, gender: true, variants: true, images: true },
    });
  },
  ["products"],
  {
    tags: ["products"],
    revalidate: 3600, // Cache for 1 hour
  },
);
```

**Benefits:**

- Multiple concurrent requests for products share the same database query
- Results are cached for 1 hour (3600 seconds)
- Tagged with `"products"` for granular cache invalidation

### Filter Options Caching (`lib/filters.ts`)

Each filter type (genders, brands, categories, colors, sizes) uses its own cached function:

```typescript
const getCachedGenders = unstable_cache(
  async () => db.query.genders.findMany({ orderBy: (gender, { asc }) => asc(gender.label) }),
  ["genders"],
  { tags: ["filters", "genders"], revalidate: 3600 },
);
```

**Benefits:**

- Filter data rarely changes, making it ideal for caching
- Multiple tags allow invalidating all filters at once or specific ones
- 1-hour cache duration reduces database load

## How Multiple Concurrent Requests Work

### Without Caching (Previous Behavior)

```
Request 1 → Database Query → Response
Request 2 → Database Query → Response (duplicate query)
Request 3 → Database Query → Response (duplicate query)
```

- Each request executes its own database query
- High database load during traffic spikes
- Increased latency and costs

### With Caching (Current Behavior)

```
Request 1 → Database Query → Cache Result → Response
Request 2 → Read from Cache → Response (instant)
Request 3 → Read from Cache → Response (instant)
```

- First request executes database query and caches result
- Subsequent requests within the cache window read from cache
- Significantly reduced database load and improved response times

## Cache Invalidation

### Manual Revalidation

Use Next.js `updateTag()` to invalidate specific caches:

```typescript
import { updateTag } from "next/cache";

// Invalidate all product data
updateTag("products");

// Invalidate all filter data
updateTag("filters");

// Invalidate specific filter
updateTag("genders");
```

Or use the provided utility functions:

```typescript
import { invalidateProductsCache, invalidateFiltersCache } from "@/lib/cache";

// Invalidate all product data
invalidateProductsCache();

// Invalidate all filter data
invalidateFiltersCache();
```

### Automatic Revalidation

Caches automatically expire after the `revalidate` period (1 hour by default).

### Use Cases for Manual Invalidation

- After adding/updating/deleting products via admin panel
- After modifying filter options (categories, brands, etc.)
- During data migrations or seeding operations

## Configuration

### Adjusting Cache Duration

Modify the `revalidate` value in cache configurations:

```typescript
{
  tags: ["products"],
  revalidate: 3600, // Change this value (in seconds)
}
```

**Recommendations:**

- **Product data**: 1 hour (3600s) - balances freshness with performance
- **Filter options**: 2-4 hours (7200-14400s) - very stable data
- **User sessions**: No caching - handled by Better Auth

### Disabling Cache (Development)

To test without caching, set `revalidate: 0` or remove `unstable_cache` wrapper temporarily.

## Performance Metrics

### Expected Improvements

- **Database Query Reduction**: ~90-95% for repeated requests
- **Response Time**: Cache hits respond in <10ms vs ~50-200ms for database queries
- **Database Load**: Significantly reduced, especially during traffic spikes
- **Cost Savings**: Fewer database queries = lower Neon compute usage

## Best Practices

1. **Cache Stable Data**: Products and filters change infrequently - ideal for caching
2. **Avoid Caching User Data**: Session-specific data should not be cached
3. **Use Appropriate TTL**: Balance between data freshness and performance
4. **Tag Strategically**: Use multiple tags for flexible invalidation
5. **Monitor Cache Hit Rates**: Track effectiveness in production

## Production Considerations

### Neon Connection Configuration

Ensure your `DATABASE_URL` uses Neon's pooled connection mode for optimal performance:

```
postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### Vercel Deployment

Next.js caching works seamlessly on Vercel with:

- Automatic cache replication across edge regions
- Fast cache access via Vercel's infrastructure
- Built-in monitoring and analytics

## Troubleshooting

### Cache Not Working

- Verify Next.js version supports `unstable_cache`
- Check that cache keys are unique and consistent
- Ensure `revalidate` value is not `0`

### Stale Data Issues

- Reduce `revalidate` duration
- Implement manual cache invalidation on data changes
- Use cache tags for granular control

### Memory Usage

- `unstable_cache` stores data in Next.js cache (not application memory)
- Cache size is managed automatically by Next.js
- Monitor cache performance in production

## Related Documentation

- [Next.js Data Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)

## Summary

**PL:** Ani Drizzle ani Neon nie oferują wbudowanego cachowania wyników zapytań. Aby zoptymalizować wydajność i obsłużyć wiele równoczesnych requestów, aplikacja wykorzystuje `unstable_cache` z Next.js, który deduplikuje zapytania i cachuje wyniki na 1 godzinę. Dzięki temu pierwsze zapytanie trafia do bazy danych, a kolejne korzystają z cache'a, co znacznie redukuje obciążenie bazy i poprawia czas odpowiedzi.

**EN:** Neither Drizzle nor Neon provide built-in query result caching. To optimize performance and handle multiple concurrent requests, the application uses Next.js `unstable_cache`, which deduplicates queries and caches results for 1 hour. This means the first request hits the database while subsequent requests use the cache, significantly reducing database load and improving response times.
