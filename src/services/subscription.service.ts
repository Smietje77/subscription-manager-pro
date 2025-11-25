import { supabase } from '@/lib/supabase';
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SubscriptionQuery,
} from '@/lib/validations/subscription';
import type { SubscriptionWithDetails } from '@/types';

export class SubscriptionService {
  /**
   * Get all subscriptions for a user with full details
   */
  static async getUserSubscriptions(
    userId: string,
    query?: SubscriptionQuery
  ): Promise<{ data: SubscriptionWithDetails[]; total: number }> {
    let queryBuilder = supabase
      .from('subscriptions')
      .select(
        `
        id,
        status,
        start_date,
        end_date,
        next_billing_date,
        custom_amount,
        custom_currency,
        notes,
        created_at,
        plan:plans (
          id,
          name,
          description,
          product:products (
            id,
            name,
            logo_url,
            category:categories (
              id,
              name,
              slug,
              color
            )
          )
        ),
        price:prices (
          id,
          amount,
          currency,
          interval
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', userId);

    // Apply filters
    if (query?.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    // Apply sorting
    if (query?.sortBy) {
      queryBuilder = queryBuilder.order(query.sortBy, {
        ascending: query.sortOrder === 'asc',
      });
    }

    // Apply pagination
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    return {
      data: (data || []) as unknown as SubscriptionWithDetails[],
      total: count || 0,
    };
  }

  /**
   * Get a single subscription by ID
   */
  static async getSubscription(
    id: string,
    userId: string
  ): Promise<SubscriptionWithDetails | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(
        `
        id,
        status,
        start_date,
        end_date,
        next_billing_date,
        custom_amount,
        custom_currency,
        notes,
        plan:plans (
          id,
          name,
          description,
          product:products (
            id,
            name,
            logo_url,
            category:categories (
              id,
              name,
              slug,
              color
            )
          )
        ),
        price:prices (
          id,
          amount,
          currency,
          interval
        )
      `
      )
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data as unknown as SubscriptionWithDetails;
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(userId: string, input: CreateSubscriptionInput) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: input.planId,
        price_id: input.priceId,
        start_date: input.startDate || new Date().toISOString(),
        custom_amount: input.customAmount || null,
        custom_currency: input.customCurrency || null,
        notes: input.notes || null,
        status: 'active' as const,
        cancellation_notice_period: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Update an existing subscription
   */
  static async updateSubscription(
    id: string,
    userId: string,
    input: UpdateSubscriptionInput
  ) {
    const updateData: {
      status?: 'active' | 'cancelled' | 'paused' | 'expired';
      end_date?: string | null;
      next_billing_date?: string | null;
      custom_amount?: number | null;
      custom_currency?: string | null;
      notes?: string | null;
    } = {};

    if (input.status !== undefined) updateData.status = input.status;
    if (input.endDate !== undefined) updateData.end_date = input.endDate || null;
    if (input.nextBillingDate !== undefined) updateData.next_billing_date = input.nextBillingDate || null;
    if (input.customAmount !== undefined) updateData.custom_amount = input.customAmount || null;
    if (input.customCurrency !== undefined) updateData.custom_currency = input.customCurrency || null;
    if (input.notes !== undefined) updateData.notes = input.notes || null;

    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Delete a subscription
   */
  static async deleteSubscription(id: string, userId: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  }

  /**
   * Calculate total spending for a user
   */
  static async calculateSpending(userId: string): Promise<{
    monthly: number;
    yearly: number;
    currency: string;
  }> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(
        `
        price:prices (
          amount,
          currency,
          interval
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;

    let monthlyTotal = 0;
    const currency = 'USD'; // Default currency, should be user's preferred currency

    data?.forEach((sub: any) => {
      const price = sub.price;
      if (!price) return;

      let monthlyAmount = price.amount;

      // Convert to monthly amount
      switch (price.interval) {
        case 'weekly':
          monthlyAmount = price.amount * 4.33; // Average weeks per month
          break;
        case 'monthly':
          monthlyAmount = price.amount;
          break;
        case 'quarterly':
          monthlyAmount = price.amount / 3;
          break;
        case 'yearly':
          monthlyAmount = price.amount / 12;
          break;
      }

      monthlyTotal += monthlyAmount;
    });

    return {
      monthly: Math.round(monthlyTotal * 100) / 100,
      yearly: Math.round(monthlyTotal * 12 * 100) / 100,
      currency,
    };
  }

  /**
   * Get upcoming renewals for a user
   */
  static async getUpcomingRenewals(userId: string, daysAhead: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('subscriptions')
      .select(
        `
        id,
        next_billing_date,
        plan:plans (
          name,
          product:products (
            name,
            logo_url
          )
        ),
        price:prices (
          amount,
          currency
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .not('next_billing_date', 'is', null)
      .lte('next_billing_date', futureDate.toISOString())
      .order('next_billing_date', { ascending: true });

    if (error) throw error;

    return data;
  }
}
