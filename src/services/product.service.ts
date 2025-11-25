import { supabase } from '@/lib/supabase';
import type {
  CreateProductInput,
  UpdateProductInput,
  CreatePlanInput,
  UpdatePlanInput,
  CreatePriceInput,
  UpdatePriceInput,
} from '@/lib/validations/product';

export class ProductService {
  /**
   * Get all products with their plans and prices
   */
  static async getProducts(categoryId?: string) {
    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        logo_url,
        website_url,
        is_active,
        category:categories (
          id,
          name,
          slug,
          color
        ),
        plans (
          id,
          name,
          description,
          features,
          prices (
            id,
            amount,
            currency,
            interval,
            is_active
          )
        )
      `
      )
      .eq('is_active', true)
      .order('name');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
  }

  /**
   * Get a single product by slug or ID
   */
  static async getProduct(identifier: string) {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        logo_url,
        website_url,
        is_active,
        category:categories (
          id,
          name,
          slug,
          color
        ),
        plans (
          id,
          name,
          description,
          features,
          prices (
            id,
            amount,
            currency,
            interval,
            is_active
          )
        )
      `
      )
      .or(`id.eq.${identifier},slug.eq.${identifier}`)
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Create a new product (admin only)
   */
  static async createProduct(input: CreateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description,
        logo_url: input.logoUrl || null,
        website_url: input.websiteUrl || null,
        category_id: input.categoryId,
        is_active: input.isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Update a product (admin only)
   */
  static async updateProduct(id: string, input: UpdateProductInput) {
    const updateData: {
      name?: string;
      slug?: string;
      description?: any;
      logo_url?: string | null;
      website_url?: string | null;
      category_id?: string;
      is_active?: boolean;
    } = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.logoUrl !== undefined) updateData.logo_url = input.logoUrl || null;
    if (input.websiteUrl !== undefined) updateData.website_url = input.websiteUrl || null;
    if (input.categoryId !== undefined) updateData.category_id = input.categoryId;
    if (input.isActive !== undefined) updateData.is_active = input.isActive;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Delete a product (admin only)
   */
  static async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  }

  // ==================== PLAN METHODS ====================

  /**
   * Create a new plan for a product (admin only)
   */
  static async createPlan(input: CreatePlanInput) {
    const { data, error } = await supabase
      .from('plans')
      .insert({
        product_id: input.productId,
        name: input.name,
        description: input.description || null,
        features: input.features,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Update a plan (admin only)
   */
  static async updatePlan(id: string, input: UpdatePlanInput) {
    const updateData: {
      name?: string;
      description?: string | null;
      features?: any;
    } = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description || null;
    if (input.features !== undefined) updateData.features = input.features;

    const { data, error } = await supabase
      .from('plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Delete a plan (admin only)
   */
  static async deletePlan(id: string) {
    const { error } = await supabase.from('plans').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  }

  // ==================== PRICE METHODS ====================

  /**
   * Create a new price for a plan (admin only)
   */
  static async createPrice(input: CreatePriceInput) {
    const { data, error } = await supabase
      .from('prices')
      .insert({
        plan_id: input.planId,
        amount: input.amount,
        currency: input.currency,
        interval: input.interval,
        is_active: input.isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Update a price (admin only)
   */
  static async updatePrice(id: string, input: UpdatePriceInput) {
    // Get old price for history
    const { data: oldPrice } = await supabase.from('prices').select('amount').eq('id', id).single();

    const updateData: {
      amount?: number;
      currency?: string;
      interval?: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
      is_active?: boolean;
    } = {};

    if (input.amount !== undefined) updateData.amount = input.amount;
    if (input.currency !== undefined) updateData.currency = input.currency;
    if (input.interval !== undefined) updateData.interval = input.interval;
    if (input.isActive !== undefined) updateData.is_active = input.isActive;

    const { data, error } = await supabase
      .from('prices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create price history record if amount changed
    if (oldPrice && input.amount && oldPrice.amount !== input.amount) {
      await supabase.from('price_history').insert({
        price_id: id,
        old_amount: oldPrice.amount,
        new_amount: input.amount,
        change_reason: 'Manual update',
        effective_date: new Date().toISOString(),
      });
    }

    return data;
  }

  /**
   * Delete a price (admin only)
   */
  static async deletePrice(id: string) {
    const { error } = await supabase.from('prices').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  }
}
