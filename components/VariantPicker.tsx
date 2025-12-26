import Image from "next/image";
import Link from "next/link";

import { type Image as VariantImage, Variant } from "@/lib/products/types";

interface Props {
	variants: Variant[];
	currentVariantSku: string;
	productSlug: string;
}

export function VariantPicker({ variants, currentVariantSku, productSlug }: Props) {
	return (
		<div className="flex flex-wrap gap-2" role="group" aria-label="Select color">
			{variants.map(variant => {
				const isSelected = variant.sku === currentVariantSku;
				const href = `/products/${productSlug}/${variant.sku}`;

				return (
					<Link
						key={variant.id}
						href={href}
						aria-label={`Select ${variant.color} color${isSelected ? " (currently selected)" : ""}`}
						aria-current={isSelected ? "true" : undefined}
						className={`relative h-14 w-14 overflow-hidden rounded-md border-2 transition-all hover:border-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 ${
							isSelected ? "border-dark-900" : "border-light-300"
						}`}
					>
						<Image
							src={(variant.images?.[0] as VariantImage).url}
							alt={variant.color}
							fill
							sizes="56px"
							className="object-cover"
						/>
					</Link>
				);
			})}
		</div>
	);
}

export default VariantPicker;
