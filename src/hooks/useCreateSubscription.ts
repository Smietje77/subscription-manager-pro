import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiResponse, SubscriptionWithDetails } from '@/types';

interface CreateSubscriptionInput {
  planId: string;
  priceId: string;
  startDate?: string;
  customAmount?: number;
  customCurrency?: string;
  notes?: string;
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubscriptionInput) => {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create subscription');
      }

      const data: ApiResponse<SubscriptionWithDetails> = await response.json();
      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      // Show success toast
      toast.success('Subscription created successfully!');
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || 'Failed to create subscription');
    },
  });
}
