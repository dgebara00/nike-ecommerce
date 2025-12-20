import Image from "next/image";
import Link from "next/link";

export interface ColorOption {
	id: string;
	name: string;
	slug: string;
	hexCode: string;
	image: string;
}

interface ColorPickerProps {
	colors: ColorOption[];
	currentSlug: string;
	productSlug: string;
}

export function ColorPicker({ colors, currentSlug, productSlug }: ColorPickerProps) {
	return (
		<div className="flex flex-wrap gap-2" role="group" aria-label="Select color">
			{colors.map(color => {
				const isSelected = color.slug === currentSlug;
				const href = `/products/${productSlug}/${color.slug}`;

				return (
					<Link
						key={color.id}
						href={href}
						aria-label={`Select ${color.name} color${isSelected ? " (currently selected)" : ""}`}
						aria-current={isSelected ? "true" : undefined}
						className={`relative h-14 w-14 overflow-hidden rounded-md border-2 transition-all hover:border-dark-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 ${
							isSelected ? "border-dark-900" : "border-light-300"
						}`}
					>
						<Image src={color.image} alt={color.name} fill sizes="56px" className="object-cover" />
					</Link>
				);
			})}
		</div>
	);
}

export default ColorPicker;
