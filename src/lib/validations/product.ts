import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.record(z.string()).optional(),
  logoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  categoryId: z.string().uuid(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const createPlanSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  features: z.array(z.string()).default([]),
});

export const updatePlanSchema = createPlanSchema.partial().omit({ productId: true });

export const createPriceSchema = z.object({
  planId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  interval: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  isActive: z.boolean().default(true),
});

export const updatePriceSchema = createPriceSchema.partial().omit({ planId: true });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type CreatePriceInput = z.infer<typeof createPriceSchema>;
export type UpdatePriceInput = z.infer<typeof updatePriceSchema>;
