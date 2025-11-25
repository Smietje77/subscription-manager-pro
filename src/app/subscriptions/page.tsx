'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionList } from '@/components/subscriptions/subscription-list';
import { AddSubscriptionDialog } from '@/components/subscriptions/add-subscription-dialog';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const { data: subscriptionsData, isLoading, error } = useSubscriptions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleEdit = (id: string) => {
    toast.info('Edit functionality coming soon', {
      description: `Editing subscription ${id}`,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription');
      }

      toast.success('Subscription deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete subscription');
    }
  };

  const handleExport = () => {
    if (!subscriptionsData?.data) return;

    const csvContent = [
      ['Product', 'Plan', 'Status', 'Amount', 'Currency', 'Interval', 'Next Billing', 'Category'].join(','),
      ...subscriptionsData.data.map((sub) =>
        [
          sub.plan.product.name,
          sub.plan.name,
          sub.status,
          sub.price.amount,
          sub.price.currency,
          sub.price.interval,
          sub.nextBillingDate || 'N/A',
          sub.plan.product.category.name,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Subscriptions exported successfully');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8">
          <LoadingSpinner text="Loading subscriptions..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-destructive">Failed to load subscriptions. Please try again.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Subscriptions</h1>
            <p className="mt-2 text-muted-foreground">
              Manage all your subscriptions in one place
            </p>
          </div>
          <div className="flex gap-3">
            {subscriptionsData?.data && subscriptionsData.data.length > 0 && (
              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
            <AddSubscriptionDialog />
          </div>
        </div>

        {subscriptionsData?.data && (
          <SubscriptionList
            subscriptions={subscriptionsData.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No subscriptions yet. Add your first subscription to get started!"
          />
        )}
      </div>
    </>
  );
}
