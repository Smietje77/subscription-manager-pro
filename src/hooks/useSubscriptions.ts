import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import type { SubscriptionWithDetails, ApiResponse } from '@/types';

interface SubscriptionQuery {
  status?: string;
  page?: number;
  limit?: number;
}

export function useSubscriptions(query?: SubscriptionQuery) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscriptions', user?.id, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.status) params.append('status', query.status);
      if (query?.page) params.append('page', query.page.toString());
      if (query?.limit) params.append('limit', query.limit.toString());

      const response = await fetch(`/api/subscriptions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch subscriptions');

      const data: ApiResponse<SubscriptionWithDetails[]> = await response.json();
      return data;
    },
    enabled: !!user,
  });
}
