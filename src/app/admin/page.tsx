'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { LoadingSpinner } from '@/components/ui/spinner';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Package,
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalProducts: number;
  totalCategories: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error('Failed to fetch admin stats');
      }
      const data = await response.json();
      return data.data as AdminStats;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="container mx-auto p-8">
            <LoadingSpinner text="Loading admin dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="container mx-auto p-8">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-destructive">
                {error instanceof Error ? error.message : 'Failed to load admin dashboard'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto space-y-8 p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Platform overview and management tools
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DashboardCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              description={`${stats?.activeUsers || 0} active`}
            />
            <DashboardCard
              title="Total Subscriptions"
              value={stats?.totalSubscriptions || 0}
              icon={CreditCard}
              description={`${stats?.activeSubscriptions || 0} active`}
            />
            <DashboardCard
              title="Products"
              value={stats?.totalProducts || 0}
              icon={Package}
            />
            <DashboardCard
              title="Monthly Revenue"
              value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
              icon={DollarSign}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="/admin/users"
                    className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Users</p>
                      <p className="text-sm text-muted-foreground">
                        View and manage users
                      </p>
                    </div>
                  </a>
                  <a
                    href="/admin/products"
                    className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Products</p>
                      <p className="text-sm text-muted-foreground">
                        Add and edit products
                      </p>
                    </div>
                  </a>
                  <a
                    href="/admin/categories"
                    className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Categories</p>
                      <p className="text-sm text-muted-foreground">
                        Manage categories
                      </p>
                    </div>
                  </a>
                  <a
                    href="/dashboard/analytics"
                    className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        View platform analytics
                      </p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      User Growth (30d)
                    </span>
                    <span className="font-medium text-green-500">+12.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Subscription Growth (30d)
                    </span>
                    <span className="font-medium text-green-500">+8.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active Users Rate
                    </span>
                    <span className="font-medium">
                      {stats?.totalUsers
                        ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      API Response Time
                    </span>
                    <span className="font-medium text-green-500">45ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
