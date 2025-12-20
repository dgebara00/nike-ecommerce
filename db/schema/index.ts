import { defineRelations } from "drizzle-orm";

// Auth-related schemas
export * from "./user";
export * from "./session";
export * from "./account";
export * from "./verification";
export * from "./guest";

// Filter schemas
export * from "./filters";

// Core product schemas
export * from "./categories";
export * from "./products";
export * from "./variants";
export * from "./variantSizes";
export * from "./images";
export * from "./collections";

// User interaction schemas
export * from "./addresses";
export * from "./reviews";
export * from "./wishlists";

// Cart and order schemas
export * from "./carts";
export * from "./orders";
export * from "./coupons";

// Import all tables for relations
import { user } from "./user";
import { session } from "./session";
import { account } from "./account";
import { verification } from "./verification";
import { guest } from "./guest";
import { genders, colors, sizes, brands } from "./filters";
import { categories } from "./categories";
import { products } from "./products";
import { productVariants } from "./variants";
import { productImages } from "./images";
import { collections, productCollections } from "./collections";
import { addresses } from "./addresses";
import { reviews } from "./reviews";
import { wishlists } from "./wishlists";
import { carts, cartItems } from "./carts";
import { orders, orderItems, payments } from "./orders";
import { coupons } from "./coupons";
import { productVariantSizes } from "./variantSizes";

// Define all relations using the new defineRelations() API
export const relations = defineRelations(
	{
		user,
		session,
		account,
		verification,
		guest,
		genders,
		colors,
		sizes,
		brands,
		categories,
		products,
		productVariants,
		productVariantSizes,
		productImages,
		collections,
		productCollections,
		addresses,
		reviews,
		wishlists,
		carts,
		cartItems,
		orders,
		orderItems,
		payments,
		coupons,
	},
	r => ({
		// User relations
		user: {
			sessions: r.many.session({
				from: r.user.id,
				to: r.session.userId,
			}),
			accounts: r.many.account({
				from: r.user.id,
				to: r.account.userId,
			}),
			addresses: r.many.addresses({
				from: r.user.id,
				to: r.addresses.userId,
			}),
			reviews: r.many.reviews({
				from: r.user.id,
				to: r.reviews.userId,
			}),
			wishlists: r.many.wishlists({
				from: r.user.id,
				to: r.wishlists.userId,
			}),
			carts: r.many.carts({
				from: r.user.id,
				to: r.carts.userId,
			}),
			orders: r.many.orders({
				from: r.user.id,
				to: r.orders.userId,
			}),
		},

		// Session relations
		session: {
			user: r.one.user({
				from: r.session.userId,
				to: r.user.id,
			}),
		},

		// Account relations
		account: {
			user: r.one.user({
				from: r.account.userId,
				to: r.user.id,
			}),
		},

		// Guest relations
		guest: {
			carts: r.many.carts({
				from: r.guest.id,
				to: r.carts.guestId,
			}),
		},

		// Category relations (self-referencing for parent/child)
		categories: {
			parent: r.one.categories({
				from: r.categories.parentId,
				to: r.categories.id,
				optional: true,
			}),
			children: r.many.categories({
				from: r.categories.id,
				to: r.categories.parentId,
			}),
			products: r.many.products({
				from: r.categories.id,
				to: r.products.categoryId,
			}),
		},

		// Gender relations
		genders: {
			products: r.many.products({
				from: r.genders.id,
				to: r.products.genderId,
			}),
		},

		// Brand relations
		brands: {
			products: r.many.products({
				from: r.brands.id,
				to: r.products.brandId,
			}),
		},

		// Color relations
		colors: {
			variants: r.many.productVariants({
				from: r.colors.id,
				to: r.productVariants.colorId,
			}),
		},

		// Size relations
		sizes: {
			variantSize: r.one.productVariantSizes({
				from: r.sizes.id,
				to: r.productVariantSizes.sizeId,
			}),
		},

		// Product relations
		products: {
			category: r.one.categories({
				from: r.products.categoryId,
				to: r.categories.id,
			}),
			gender: r.one.genders({
				from: r.products.genderId,
				to: r.genders.id,
			}),
			brand: r.one.brands({
				from: r.products.brandId,
				to: r.brands.id,
			}),
			defaultVariant: r.one.productVariants({
				from: r.products.defaultVariantId,
				to: r.productVariants.id,
				optional: true,
			}),
			variants: r.many.productVariants({
				from: r.products.id,
				to: r.productVariants.productId,
			}),
			reviews: r.many.reviews({
				from: r.products.id,
				to: r.reviews.productId,
			}),
			wishlists: r.many.wishlists({
				from: r.products.id,
				to: r.wishlists.productId,
			}),
			productCollections: r.many.productCollections({
				from: r.products.id,
				to: r.productCollections.productId,
			}),
		},

		// Product variant relations
		productVariants: {
			product: r.one.products({
				from: r.productVariants.productId,
				to: r.products.id,
			}),
			color: r.one.colors({
				from: r.productVariants.colorId,
				to: r.colors.id,
			}),
			images: r.many.productImages({
				from: r.productVariants.id,
				to: r.productImages.variantId,
			}),
			variantSizes: r.many.productVariantSizes({
				from: r.productVariants.id,
				to: r.productVariantSizes.variantId,
			}),
		},

		productVariantSizes: {
			variant: r.one.productVariants({
				from: r.productVariantSizes.variantId,
				to: r.productVariants.id,
			}),
			size: r.one.sizes({
				from: r.productVariantSizes.sizeId,
				to: r.sizes.id,
			}),
			cartItems: r.many.cartItems({
				from: r.productVariantSizes.id,
				to: r.cartItems.productVariantSizeId,
			}),
			orderItems: r.many.orderItems({
				from: r.productVariantSizes.id,
				to: r.orderItems.productVariantSizeId,
			}),
		},

		// Product image relations
		productImages: {
			variant: r.one.productVariants({
				from: r.productImages.variantId,
				to: r.productVariants.id,
				optional: true,
			}),
		},

		// Collection relations
		collections: {
			productCollections: r.many.productCollections({
				from: r.collections.id,
				to: r.productCollections.collectionId,
			}),
		},

		// Product-Collection junction relations
		productCollections: {
			product: r.one.products({
				from: r.productCollections.productId,
				to: r.products.id,
			}),
			collection: r.one.collections({
				from: r.productCollections.collectionId,
				to: r.collections.id,
			}),
		},

		// Address relations
		addresses: {
			user: r.one.user({
				from: r.addresses.userId,
				to: r.user.id,
			}),
			shippingOrders: r.many.orders({
				from: r.addresses.id,
				to: r.orders.shippingAddressId,
			}),
			billingOrders: r.many.orders({
				from: r.addresses.id,
				to: r.orders.billingAddressId,
			}),
		},

		// Review relations
		reviews: {
			product: r.one.products({
				from: r.reviews.productId,
				to: r.products.id,
			}),
			user: r.one.user({
				from: r.reviews.userId,
				to: r.user.id,
			}),
		},

		// Wishlist relations
		wishlists: {
			user: r.one.user({
				from: r.wishlists.userId,
				to: r.user.id,
			}),
			product: r.one.products({
				from: r.wishlists.productId,
				to: r.products.id,
			}),
		},

		// Cart relations
		carts: {
			user: r.one.user({
				from: r.carts.userId,
				to: r.user.id,
				optional: true,
			}),
			guest: r.one.guest({
				from: r.carts.guestId,
				to: r.guest.id,
				optional: true,
			}),
			items: r.many.cartItems({
				from: r.carts.id,
				to: r.cartItems.cartId,
			}),
		},

		// Cart item relations
		cartItems: {
			cart: r.one.carts({
				from: r.cartItems.cartId,
				to: r.carts.id,
			}),
			variantSize: r.one.productVariantSizes({
				from: r.cartItems.productVariantSizeId,
				to: r.productVariantSizes.id,
			}),
		},

		// Order relations
		orders: {
			user: r.one.user({
				from: r.orders.userId,
				to: r.user.id,
			}),
			shippingAddress: r.one.addresses({
				from: r.orders.shippingAddressId,
				to: r.addresses.id,
			}),
			billingAddress: r.one.addresses({
				from: r.orders.billingAddressId,
				to: r.addresses.id,
			}),
			items: r.many.orderItems({
				from: r.orders.id,
				to: r.orderItems.orderId,
			}),
			payments: r.many.payments({
				from: r.orders.id,
				to: r.payments.orderId,
			}),
		},

		// Order item relations
		orderItems: {
			order: r.one.orders({
				from: r.orderItems.orderId,
				to: r.orders.id,
			}),
			variantSize: r.one.productVariantSizes({
				from: r.orderItems.productVariantSizeId,
				to: r.productVariantSizes.id,
			}),
		},

		// Payment relations
		payments: {
			order: r.one.orders({
				from: r.payments.orderId,
				to: r.orders.id,
			}),
		},
	})
);
