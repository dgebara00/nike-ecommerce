import Image from "next/image";
import Link from "next/link";

interface CardProps {
  id?: string | number;
  title: string;
  category: string;
  price: number;
  image: string;
  colorCount?: number;
  badge?: string;
  href?: string;
}

export function Card({ id, title, category, price, image, colorCount, badge, href }: CardProps) {
  const cardContent = (
    <article className="group flex flex-col overflow-hidden rounded-lg">
      {/* Image Section */}
      <div className="relative aspect-square bg-light-200">
        {/* Badge */}
        {badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-red px-4 py-1.5 text-caption font-caption text-light-100">
            {badge}
          </span>
        )}

        {/* Product Image */}
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1 bg-transparent px-4 py-4">
        {/* Title and Price Row */}
        <div className="flex items-start justify-between gap-2 font-medium">
          <h3 className="text-dark-900">{title}</h3>
          <span className="flex-shrink-0 text-dark-900">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Category */}
        <p className="text-caption font-caption text-dark-700">{category}</p>

        {/* Color Count */}
        {colorCount && colorCount > 0 && (
          <p className="text-caption font-caption text-dark-700">{colorCount} Colour</p>
        )}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  if (id) {
    return (
      <Link href={`/products/${id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default Card;
