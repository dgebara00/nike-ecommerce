export interface ProductReview {
	id: string;
	rating: number;
	title: string;
	content: string;
	author: string;
	date: string;
}

export interface ShippingInfo {
	freeShipping: string;
	returns: string;
	pickup: string;
}

export interface RelatedProduct {
	id: string;
	slug: string;
	name: string;
	category: string;
	priceMin: number;
	priceMax: number;
	image: string;
	badge?: string;
	colorCount?: number;
}

export const mockReviews: ProductReview[] = [
	{
		id: "1",
		rating: 5,
		title: "Perfect fit and style!",
		content: "These shoes are amazing. The comfort level is incredible and they look great with everything.",
		author: "Sarah M.",
		date: "2024-01-15",
	},
	{
		id: "2",
		rating: 5,
		title: "Best Air Max yet",
		content: "I've owned many Air Max shoes but these are by far my favorite. The color is beautiful.",
		author: "John D.",
		date: "2024-01-10",
	},
	{
		id: "3",
		rating: 4,
		title: "Great quality",
		content: "Very comfortable and well-made. Would recommend to anyone looking for stylish sneakers.",
		author: "Emily R.",
		date: "2024-01-05",
	},
];

export const mockShipping: ShippingInfo = {
	freeShipping: "Free standard shipping on orders $50+ and free 60-day returns for Nike Members.",
	returns: "Return or exchange your order within 60 days. Items must be unworn and unwashed. Some exclusions apply.",
	pickup: "Select 'Pick Up' at checkout to see if your item is available at a store near you.",
};

export const mockRelatedProducts: RelatedProduct[] = [
	{
		id: "2",
		slug: "air-force-1-mid-07",
		name: "Nike Air Force 1 Mid '07",
		category: "Men's Shoes",
		priceMin: 98.3,
		priceMax: 98.3,
		image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop",
		badge: "Best Seller",
		colorCount: 6,
	},
	{
		id: "3",
		slug: "court-vision-low-next-nature",
		name: "Nike Court Vision Low Next Nature",
		category: "Men's Shoes",
		priceMin: 98.3,
		priceMax: 98.3,
		image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop",
		badge: "Extra 20% off",
		colorCount: 4,
	},
	{
		id: "4",
		slug: "dunk-low-retro",
		name: "Nike Dunk Low Retro",
		category: "Men's Shoes",
		priceMin: 98.3,
		priceMax: 98.3,
		image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
		badge: "Extra 10% off",
		colorCount: 6,
	},
	{
		id: "5",
		slug: "air-max-97",
		name: "Nike Air Max 97",
		category: "Women's Shoes",
		priceMin: 175,
		priceMax: 175,
		image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&h=800&fit=crop",
		colorCount: 3,
	},
];
