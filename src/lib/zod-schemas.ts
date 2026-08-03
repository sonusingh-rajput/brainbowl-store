import { z } from 'zod';

export const checkoutSchema = z.object({
  productId: z.string().uuid('Invalid Product ID'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  shippingAddress: z.string().min(10, 'Please enter a complete delivery address'),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Razorpay Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Razorpay Signature is required'),
});

export const orderLookupSchema = z.object({
  query: z.string().min(4, 'Enter a valid Phone number or Receipt ID'),
});