import { SubscriptionWithDetails } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from './price-display';
import { CategoryBadge } from '@/components/categories/category-badge';
import { Calendar, CreditCard, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: SubscriptionWithDetails;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'success'> = {
  active: 'success',
  cancelled: 'secondary',
  paused: 'secondary',
  expired: 'destructive',
};

export function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
  className,
}: SubscriptionCardProps) {
  const { plan, price, status, nextBillingDate } = subscription;
  const { product } = plan;

  return (
    <Card className={cn('hover:shadow-lg transition-all duration-200', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {product.logoUrl ? (
              <img
                src={product.logoUrl}
                alt={product.name}
                className="h-12 w-12 rounded-md object-cover border"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.name}</p>
            </div>
          </div>
          <Badge variant={statusVariants[status] || 'default'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <PriceDisplay
          amount={price.amount}
          currency={price.currency}
          interval={price.interval}
        />

        {nextBillingDate && status === 'active' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Next billing: {new Date(nextBillingDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {product.category && (
          <CategoryBadge
            name={product.category.name}
            icon={product.category.icon || undefined}
            color={product.category.color || undefined}
          />
        )}
      </CardContent>

      {(onEdit || onDelete) && (
        <CardFooter className="gap-2 pt-3">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(subscription.id)}
              className="flex-1 gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(subscription.id)}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
