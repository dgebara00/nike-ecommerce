"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";

export interface RelatedProductItem {
	id: string;
	slug: string;
	name: string;
	category: string;
	priceMin: number;
	priceMax: number;
	image: string;
	badge?: string;
}

interface RelatedProductsProps {
	products: RelatedProductItem[];
	title?: string;
}

export function RelatedProducts({ products, title = "You Might Also Like" }: RelatedProductsProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const updateScrollButtons = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		}
	}, []);

	useEffect(() => {
		updateScrollButtons();
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener("scroll", updateScrollButtons);
			window.addEventListener("resize", updateScrollButtons);
			return () => {
				container.removeEventListener("scroll", updateScrollButtons);
				window.removeEventListener("resize", updateScrollButtons);
			};
		}
	}, [updateScrollButtons]);

	const scrollLeft = useCallback(() => {
		if (scrollContainerRef.current) {
			const cardWidth = scrollContainerRef.current.querySelector("a")?.offsetWidth || 300;
			scrollContainerRef.current.scrollBy({ left: -cardWidth - 16, behavior: "smooth" });
		}
	}, []);

	const scrollRight = useCallback(() => {
		if (scrollContainerRef.current) {
			const cardWidth = scrollContainerRef.current.querySelector("a")?.offsetWidth || 300;
			scrollContainerRef.current.scrollBy({ left: cardWidth + 16, behavior: "smooth" });
		}
	}, []);

	if (products.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="related-products-heading" className="py-12">
			<div className="flex items-center justify-between mb-8">
				<h2
					id="related-products-heading"
					className="text-heading-3 font-heading-3 text-dark-900"
				>
					{title}
				</h2>

				{/* Navigation arrows */}
				<div className="flex gap-2">
					<button
						type="button"
						onClick={scrollLeft}
						disabled={!canScrollLeft}
						aria-label="Scroll left"
						className={`flex h-10 w-10 items-center justify-center rounded-full border border-light-300 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
							canScrollLeft
								? "bg-light-100 hover:bg-light-200 text-dark-900"
								: "bg-light-200 text-dark-500 cursor-not-allowed"
						}`}
					>
						<ChevronLeft className="h-5 w-5" aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={scrollRight}
						disabled={!canScrollRight}
						aria-label="Scroll right"
						className={`flex h-10 w-10 items-center justify-center rounded-full border border-light-300 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
							canScrollRight
								? "bg-light-100 hover:bg-light-200 text-dark-900"
								: "bg-light-200 text-dark-500 cursor-not-allowed"
						}`}
					>
						<ChevronRight className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			</div>

			{/* Horizontal scrollable carousel */}
			<div
				ref={scrollContainerRef}
				className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				<style jsx>{`
					div::-webkit-scrollbar {
						display: none;
					}
				`}</style>
				{products.map((product) => (
					<div key={product.id} className="flex-shrink-0 w-72 sm:w-80 lg:w-96 snap-start">
						<Card
							id={product.id}
							title={product.name}
							category={product.category}
							priceMin={product.priceMin}
							priceMax={product.priceMax}
							image={product.image}
							badge={product.badge}
							href={`/products/${product.slug}`}
						/>
					</div>
				))}
			</div>
		</section>
	);
}

export default RelatedProducts;
