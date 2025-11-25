'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import { Navbar } from '@/components/layout/navbar';
import { LoadingSpinner } from '@/components/ui/spinner';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  PieChartIcon,
} from 'lucide-react';

interface SpendingByCategory {
  name: string;
  color: string;
  amount: number;
}

interface SpendingTrend {
  month: string;
  amount: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();

  // Fetch spending by category
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['spending-category', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/analytics/spending?type=category');
      if (!response.ok) throw new Error('Failed to fetch category spending');
      const data = await response.json();
      return data.data as SpendingByCategory[];
    },
    enabled: !!user,
  });

  // Fetch spending trend
  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['spending-trend', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/analytics/spending?type=trend');
      if (!response.ok) throw new Error('Failed to fetch spending trend');
      const data = await response.json();
      return data.data as SpendingTrend[];
    },
    enabled: !!user,
  });

  // Fetch dashboard stats for summary
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/analytics/dashboard');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      return data.data;
    },
    enabled: !!user,
  });

  const isLoading = categoryLoading || trendLoading || statsLoading;

  // Calculate insights
  const totalMonthly = categoryData?.reduce((sum, c) => sum + c.amount, 0) || 0;
  const topCategory = categoryData?.sort((a, b) => b.amount - a.amount)[0];

  // Calculate month over month change
  const currentMonth = trendData?.[trendData.length - 1]?.amount || 0;
  const previousMonth = trendData?.[trendData.length - 2]?.amount || 0;
  const monthChange = previousMonth > 0
    ? ((currentMonth - previousMonth) / previousMonth) * 100
    : 0;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8">
          <LoadingSpinner text="Loading analytics..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto space-y-8 p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Detailed insights into your subscription spending
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Monthly Spending"
            value={`$${totalMonthly.toFixed(2)}`}
            icon={DollarSign}
          />
          <DashboardCard
            title="Yearly Projection"
            value={`$${(totalMonthly * 12).toFixed(2)}`}
            icon={TrendingUp}
          />
          <DashboardCard
            title="Top Category"
            value={topCategory?.name || 'N/A'}
            icon={PieChartIcon}
            description={topCategory ? `$${topCategory.amount.toFixed(2)}/mo` : undefined}
          />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Month over Month</CardTitle>
              {monthChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-destructive" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthChange >= 0 ? 'text-destructive' : 'text-green-500'}`}>
                {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                compared to last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending Trend Chart */}
          <SpendingChart
            data={trendData || []}
            className="col-span-1"
          />

          {/* Category Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData && categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="amount"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || `hsl(${index * 45}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(value)
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  <p>No category data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData && categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData
                  .sort((a, b) => b.amount - a.amount)
                  .map((category, index) => {
                    const percentage = totalMonthly > 0
                      ? (category.amount / totalMonthly) * 100
                      : 0;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.color || '#666' }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">
                              ${category.amount.toFixed(2)}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category.color || '#666',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No spending data available. Add some subscriptions to see analytics.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
