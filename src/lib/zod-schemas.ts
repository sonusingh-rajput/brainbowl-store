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

// High Security Password Schema
export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Must contain at least one number (0-9)')
  .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character (@, #, $, etc.)');

// Indian Mobile Number & Fake Filter
export const indianPhoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9')
  .refine((phone) => !/^(\d)\1{9}$/.test(phone), {
    message: 'Repeated fake phone numbers (e.g., 9999999999) are not allowed',
  })
  .refine((phone) => !['1234567890', '9876543210'].includes(phone), {
    message: 'Sequential fake phone numbers are not allowed',
  });