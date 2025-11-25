import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  priceId: z.string().uuid('Invalid price ID'),
  startDate: z.string().datetime().or(z.date()).optional(),
  customAmount: z.number().positive().optional(),
  customCurrency: z.string().length(3).optional(),
  notes: z.string().max(500).optional(),
});

export const updateSubscriptionSchema = z.object({
  status: z.enum(['active', 'cancelled', 'paused', 'expired']).optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
  nextBillingDate: z.string().datetime().or(z.date()).nullable().optional(),
  customAmount: z.number().positive().nullable().optional(),
  customCurrency: z.string().length(3).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const subscriptionQuerySchema = z.object({
  status: z.enum(['active', 'cancelled', 'paused', 'expired']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['created_at', 'next_billing_date', 'amount']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type SubscriptionQuery = z.infer<typeof subscriptionQuerySchema>;
