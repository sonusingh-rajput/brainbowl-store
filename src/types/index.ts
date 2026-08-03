export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'FAILED';

export interface ProductType {
  id: string;
  name: string;
  tagline: string;
  price: number; // Price in paise (e.g. 29900 = ₹299.00)
  stock: number;
}

export interface CreateCheckoutInput {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
}

export interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}