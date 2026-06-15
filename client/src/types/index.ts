export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  inStock: boolean;
  brand?: string;
  vendor?: string;
  url?: string;
}

export interface ProductDetail extends Product {
  description?: string;
  categories: string[];
  attributes: Record<string, string>;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  url?: string;
}

export interface Category {
  id: string;
  name: string;
  url?: string;
  children?: Category[];
}

export interface DeliveryCity {
  canonical_name: string;
  aliases: string[];
}

export interface DeliveryInfo {
  city: string;
  date: string;
  available: boolean;
  rate_lkr?: number;
  perishable_warning?: boolean;
}

export interface OrderConfirmation {
  cart_total: number;
  delivery_charge: number;
  grand_total: number;
  currency: string;
  checkout_url: string;
  expires_in_minutes: number;
}

export interface OrderTracking {
  order_number: string;
  status: string;
  recipient_name: string;
  delivery_city: string;
  total_lkr: number;
  tracking_steps: Array<{
    status: string;
    timestamp: string;
    completed: boolean;
  }>;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  imageUrl?: string;
}
