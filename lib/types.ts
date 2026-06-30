/** Shared domain types for the Haladini storefront. */

export type CategorySlug = "bedsheets" | "cushions" | "suits" | "shirts";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in ₹ INR
  compareAtPrice?: number | null; // optional "was" price
  category: CategorySlug;
  /** Optional subcategory slug within the category, e.g. "handblock-print". */
  subcategory?: string;
  images: string[];
  sizes: string[]; // variants, e.g. ["S","M","L"] or ["Single","Double","King"]
  fabric: string;
  care?: string;
  stock: number;
  isNew: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // line id = `${productId}:${size}`
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export type PaymentMethod = "razorpay" | "cod";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId?: string | null;
  items: CartItem[];
  total: number;
  /** Applied discount code + ₹ amount, if a coupon was used. */
  coupon?: { code: string; discount: number } | null;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}
