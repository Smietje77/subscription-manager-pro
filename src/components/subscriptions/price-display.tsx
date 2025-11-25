import { BillingInterval } from '@/types';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number;
  currency: string;
  interval: BillingInterval;
  className?: string;
  showInterval?: boolean;
}

const intervalLabels: Record<BillingInterval, string> = {
  weekly: '/week',
  monthly: '/month',
  quarterly: '/quarter',
  yearly: '/year',
};

export function PriceDisplay({
  amount,
  currency,
  interval,
  className,
  showInterval = true,
}: PriceDisplayProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      <span className="text-lg font-semibold">{formattedPrice}</span>
      {showInterval && (
        <span className="text-sm text-muted-foreground">
          {intervalLabels[interval]}
        </span>
      )}
    </div>
  );
}
