import { supabase } from '@/lib/supabase';
import type { DashboardStats } from '@/types';
import { SubscriptionService } from './subscription.service';

export class AnalyticsService {
  /**
   * Get dashboard statistics for a user
   */
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Get all subscriptions
    const { data: allSubscriptions } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', userId);

    // Get active subscriptions
    const activeSubscriptions = allSubscriptions?.filter((s) => s.status === 'active') || [];

    // Get spending
    const spending = await SubscriptionService.calculateSpending(userId);

    // Get upcoming renewals (next 30 days)
    const upcomingRenewals = await SubscriptionService.getUpcomingRenewals(userId, 30);

    return {
      totalSubscriptions: allSubscriptions?.length || 0,
      activeSubscriptions: activeSubscriptions.length,
      monthlySpending: spending.monthly,
      yearlySpending: spending.yearly,
      upcomingRenewals: upcomingRenewals?.length || 0,
    };
  }

  /**
   * Get spending by category for a user
   */
  static async getSpendingByCategory(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(
        `
        price:prices (
          amount,
          currency,
          interval
        ),
        plan:plans (
          product:products (
            category:categories (
              id,
              name,
              color
            )
          )
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;

    // Group by category and calculate monthly spending
    const categorySpending = new Map<
      string,
      { name: string; color: string | null; amount: number }
    >();

    data?.forEach((sub: any) => {
      const category = sub.plan?.product?.category;
      const price = sub.price;

      if (!category || !price) return;

      let monthlyAmount = price.amount;

      // Convert to monthly amount
      switch (price.interval) {
        case 'weekly':
          monthlyAmount = price.amount * 4.33;
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

      const existing = categorySpending.get(category.id);
      if (existing) {
        existing.amount += monthlyAmount;
      } else {
        categorySpending.set(category.id, {
          name: category.name,
          color: category.color,
          amount: monthlyAmount,
        });
      }
    });

    return Array.from(categorySpending.values()).map((cat) => ({
      ...cat,
      amount: Math.round(cat.amount * 100) / 100,
    }));
  }

  /**
   * Get spending trend over time (last 12 months)
   */
  static async getSpendingTrend(userId: string) {
    // This is a simplified version
    // In a real app, you'd track subscription changes over time
    const spending = await SubscriptionService.calculateSpending(userId);

    // Generate last 12 months
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toISOString().slice(0, 7), // YYYY-MM
        amount: spending.monthly, // Simplified - same amount for all months
      });
    }

    return months;
  }

  /**
   * Get admin statistics (admin only)
   */
  static async getAdminStats() {
    const [usersResult, subscriptionsResult, productsResult] = await Promise.all([
      supabase.from('users').select('id, role, status', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('id, status', { count: 'exact', head: true }),
      supabase.from('products').select('id, is_active', { count: 'exact', head: true }),
    ]);

    const { data: activeUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    return {
      totalUsers: usersResult.count || 0,
      activeUsers: activeUsers?.length || 0,
      totalSubscriptions: subscriptionsResult.count || 0,
      activeSubscriptions: activeSubscriptions?.length || 0,
      totalProducts: productsResult.count || 0,
    };
  }
}
