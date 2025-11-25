'use client';

import { useState, useMemo } from 'react';
import { SubscriptionWithDetails, SubscriptionStatus, BillingInterval } from '@/types';
import { SubscriptionCard } from './subscription-card';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionListProps {
  subscriptions: SubscriptionWithDetails[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
  emptyMessage?: string;
  showFilters?: boolean;
}

type SortOption = 'name' | 'price' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

export function SubscriptionList({
  subscriptions,
  onEdit,
  onDelete,
  className,
  emptyMessage = 'No subscriptions found.',
  showFilters = true,
}: SubscriptionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>('all');
  const [intervalFilter, setIntervalFilter] = useState<BillingInterval | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = [...subscriptions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.plan.product.name.toLowerCase().includes(query) ||
          sub.plan.name.toLowerCase().includes(query) ||
          sub.plan.product.category.name.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    // Interval filter
    if (intervalFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.price.interval === intervalFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.plan.product.name.localeCompare(b.plan.product.name);
          break;
        case 'price':
          comparison = a.price.amount - b.price.amount;
          break;
        case 'date':
          comparison =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [subscriptions, searchQuery, statusFilter, intervalFilter, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setIntervalFilter('all');
    setSortBy('date');
    setSortDirection('desc');
  };

  const activeFilterCount = [
    searchQuery.trim() !== '',
    statusFilter !== 'all',
    intervalFilter !== 'all',
  ].filter(Boolean).length;

  if (subscriptions.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {showFilters && (
        <div className="space-y-3">
          {/* Search and Filter Toggle */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="rounded-lg border bg-card p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as SubscriptionStatus | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interval Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Billing Interval</label>
                  <Select
                    value={intervalFilter}
                    onValueChange={(value) => setIntervalFilter(value as BillingInterval | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Intervals</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Direction */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Direction</label>
                  <Button
                    variant="outline"
                    onClick={toggleSortDirection}
                    className="w-full justify-start"
                  >
                    {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </div>
              </div>

              {/* Reset Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedSubscriptions.length} of {subscriptions.length} subscriptions
      </div>

      {/* Subscription Grid */}
      {filteredAndSortedSubscriptions.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground">No subscriptions match your filters.</p>
            {activeFilterCount > 0 && (
              <Button variant="link" onClick={resetFilters} className="mt-2">
                Clear filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
