"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

import type { VariantSize } from "@/lib/products/types";

interface SizePickerProps {
	sizes: VariantSize[];
	defaultSizeId?: string;
	onSizeSelect?: (size: VariantSize) => void;
}

export function SizePicker({ sizes, defaultSizeId, onSizeSelect }: SizePickerProps) {
	const [selectedSize, setSelectedSize] = useState<string | null>(defaultSizeId ?? null);

	const handleSizeClick = (size: VariantSize) => {
		if (!size.inStock) return;

		setSelectedSize(size.id);
		onSizeSelect?.(size);
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-body font-body-medium text-dark-900">Select Size</span>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 text-caption text-dark-700 hover:text-dark-900 transition-colors focus:outline-none focus:underline"
					aria-label="Open size guide"
				>
					<Ruler className="h-4 w-4" aria-hidden="true" />
					Size Guide
				</button>
			</div>

			<div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select shoe size">
				{sizes.map(size => {
					const isSelected = selectedSize === size.id;
					const isDisabled = size.inStock === 0;

					return (
						<button
							key={size.id}
							type="button"
							role="radio"
							aria-checked={isSelected}
							aria-disabled={isDisabled}
							aria-label={`Size ${size.size}${isDisabled ? ", out of stock" : ""}${isSelected ? ", selected" : ""}`}
							disabled={isDisabled}
							onClick={() => handleSizeClick(size)}
							className={`cursor-${isDisabled ? "not-allowed" : "pointer"} flex h-12 items-center justify-center rounded-md border text-body transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 ${
								isSelected
									? "border-dark-900 bg-light-100 font-medium text-dark-900"
									: isDisabled
										? "border-light-300 bg-light-100 text-dark-500 line-through"
										: "border-light-300 bg-light-100 text-dark-900 hover:border-dark-700"
							}`}
						>
							{size.size}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default SizePicker;
