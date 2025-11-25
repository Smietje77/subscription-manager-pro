'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow, format, differenceInDays } from 'date-fns';
import { SubscriptionWithDetails } from '@/types';
import Link from 'next/link';

interface UpcomingRenewalsProps {
  subscriptions: SubscriptionWithDetails[];
  className?: string;
  limit?: number;
}

export function UpcomingRenewals({
  subscriptions,
  className,
  limit = 5,
}: UpcomingRenewalsProps) {
  const upcomingRenewals = subscriptions
    .filter((sub) => sub.status === 'active' && sub.nextBillingDate)
    .sort((a, b) => {
      const dateA = new Date(a.nextBillingDate!).getTime();
      const dateB = new Date(b.nextBillingDate!).getTime();
      return dateA - dateB;
    })
    .slice(0, limit);

  const getUrgencyColor = (dueDate: Date) => {
    const daysUntil = differenceInDays(dueDate, new Date());
    if (daysUntil <= 3) return 'destructive';
    if (daysUntil <= 7) return 'warning';
    return 'secondary';
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Renewals
          </div>
          {upcomingRenewals.length > 0 && (
            <Link href="/subscriptions">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingRenewals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No upcoming renewals</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your active subscriptions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingRenewals.map((subscription) => {
              const dueDate = new Date(subscription.nextBillingDate!);
              const daysUntil = differenceInDays(dueDate, new Date());
              const urgency = getUrgencyColor(dueDate);

              return (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {subscription.plan.product.logoUrl && (
                      <img
                        src={subscription.plan.product.logoUrl}
                        alt={subscription.plan.product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {subscription.plan.product.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(dueDate, 'MMM d, yyyy')}</span>
                        <span className="text-xs">•</span>
                        <span>
                          {daysUntil === 0
                            ? 'Today'
                            : daysUntil === 1
                            ? 'Tomorrow'
                            : formatDistanceToNow(dueDate, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={urgency}>
                      {formatAmount(
                        subscription.price.amount,
                        subscription.price.currency
                      )}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
