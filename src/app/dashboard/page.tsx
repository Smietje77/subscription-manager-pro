'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { SubscriptionCard } from '@/components/subscriptions/subscription-card';
import { AddSubscriptionDialog } from '@/components/subscriptions/add-subscription-dialog';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Navbar } from '@/components/layout/navbar';
import { CreditCard, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: subscriptionsData, isLoading: subsLoading } = useSubscriptions({
    limit: 5,
  });

  if (statsLoading || subsLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your subscriptions and spending
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Subscriptions"
            value={stats?.totalSubscriptions || 0}
            icon={CreditCard}
          />
          <DashboardCard
            title="Active Subscriptions"
            value={stats?.activeSubscriptions || 0}
            icon={TrendingUp}
            description="Currently active"
          />
          <DashboardCard
            title="Monthly Spending"
            value={`$${stats?.monthlySpending?.toFixed(2) || '0.00'}`}
            icon={DollarSign}
          />
          <DashboardCard
            title="Upcoming Renewals"
            value={stats?.upcomingRenewals || 0}
            icon={Calendar}
            description="Next 30 days"
          />
        </div>

        {/* Recent Subscriptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Subscriptions</h2>
            <AddSubscriptionDialog />
          </div>

          {subscriptionsData?.data && subscriptionsData.data.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptionsData.data.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                No subscriptions yet. Add your first subscription to get started!
              </p>
              <AddSubscriptionDialog />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
