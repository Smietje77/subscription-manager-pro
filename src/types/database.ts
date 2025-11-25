export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // User profiles and settings
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          locale: string;
          currency: string;
          timezone: string | null;
          role: 'end_user' | 'support' | 'admin' | 'super_admin';
          status: 'active' | 'blocked' | 'trial' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          locale: string;
          currency: string;
          timezone?: string | null;
          role: 'end_user' | 'support' | 'admin' | 'super_admin';
          status: 'active' | 'blocked' | 'trial' | 'inactive';
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          currency?: string;
          timezone?: string | null;
          role?: 'end_user' | 'support' | 'admin' | 'super_admin';
          status?: 'active' | 'blocked' | 'trial' | 'inactive';
        };
      };
      // Categories for subscriptions
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          icon?: string | null;
          color?: string | null;
          parent_id?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          color?: string | null;
          parent_id?: string | null;
        };
      };
      // Product catalog
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: Json;
          logo_url: string | null;
          website_url: string | null;
          category_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description: Json;
          logo_url?: string | null;
          website_url?: string | null;
          category_id: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: Json;
          logo_url?: string | null;
          website_url?: string | null;
          category_id?: string;
          is_active?: boolean;
        };
      };
      // Subscription plans
      plans: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          description: string | null;
          features: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          name: string;
          description?: string | null;
          features: Json;
        };
        Update: {
          product_id?: string;
          name?: string;
          description?: string | null;
          features?: Json;
        };
      };
      // Current prices
      prices: {
        Row: {
          id: string;
          plan_id: string;
          amount: number;
          currency: string;
          interval: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          plan_id: string;
          amount: number;
          currency: string;
          interval: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
          is_active?: boolean;
        };
        Update: {
          plan_id?: string;
          amount?: number;
          currency?: string;
          interval?: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
          is_active?: boolean;
        };
      };
      // Price history
      price_history: {
        Row: {
          id: string;
          price_id: string;
          old_amount: number;
          new_amount: number;
          change_reason: string | null;
          effective_date: string;
          created_at: string;
        };
        Insert: {
          price_id: string;
          old_amount: number;
          new_amount: number;
          change_reason?: string | null;
          effective_date: string;
        };
        Update: {
          price_id?: string;
          old_amount?: number;
          new_amount?: number;
          change_reason?: string | null;
          effective_date?: string;
        };
      };
      // User subscriptions
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          price_id: string;
          status: 'active' | 'cancelled' | 'paused' | 'expired';
          start_date: string;
          end_date: string | null;
          next_billing_date: string | null;
          cancellation_date: string | null;
          cancellation_notice_period: number;
          custom_amount: number | null;
          custom_currency: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          plan_id: string;
          price_id: string;
          status: 'active' | 'cancelled' | 'paused' | 'expired';
          start_date: string;
          end_date?: string | null;
          next_billing_date?: string | null;
          cancellation_date?: string | null;
          cancellation_notice_period?: number;
          custom_amount?: number | null;
          custom_currency?: string | null;
          notes?: string | null;
        };
        Update: {
          user_id?: string;
          plan_id?: string;
          price_id?: string;
          status?: 'active' | 'cancelled' | 'paused' | 'expired';
          start_date?: string;
          end_date?: string | null;
          next_billing_date?: string | null;
          cancellation_date?: string | null;
          cancellation_notice_period?: number;
          custom_amount?: number | null;
          custom_currency?: string | null;
          notes?: string | null;
        };
      };
      // Translations for multi-language support
      translations: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          field_name: string;
          locale: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          entity_type: string;
          entity_id: string;
          field_name: string;
          locale: string;
          value: string;
        };
        Update: {
          entity_type?: string;
          entity_id?: string;
          field_name?: string;
          locale?: string;
          value?: string;
        };
      };
      // Audit logs
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
      // Platform settings
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          category: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          category: string;
          is_public?: boolean;
        };
        Update: {
          key?: string;
          value?: Json;
          category?: string;
          is_public?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
