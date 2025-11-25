// Re-export database types
export type { Database } from './database';

// Common types
export type UserRole = 'end_user' | 'support' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'blocked' | 'trial' | 'inactive';
export type SubscriptionStatus = 'active' | 'cancelled' | 'paused' | 'expired';
export type BillingInterval = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Dashboard types
export interface DashboardStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlySpending: number;
  yearlySpending: number;
  upcomingRenewals: number;
  savingsOpportunities?: number;
}

// Product with relations
export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: Record<string, string> | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  };
  plans: Array<{
    id: string;
    name: string;
    description: string | null;
    features: string[];
    prices: Array<{
      id: string;
      amount: number;
      currency: string;
      interval: BillingInterval;
      isActive: boolean;
    }>;
  }>;
}

// Subscription with relations
export interface SubscriptionWithDetails {
  id: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  nextBillingDate: string | null;
  customAmount: number | null;
  customCurrency: string | null;
  notes: string | null;
  plan: {
    id: string;
    name: string;
    description: string | null;
    product: {
      id: string;
      name: string;
      logoUrl: string | null;
      category: {
        id: string;
        name: string;
        slug: string;
        color: string | null;
      };
    };
  };
  price: {
    id: string;
    amount: number;
    currency: string;
    interval: BillingInterval;
  };
}
