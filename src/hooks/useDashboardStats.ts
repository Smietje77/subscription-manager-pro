import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import type { DashboardStats, ApiResponse } from '@/types';

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      const response = await fetch('/api/analytics/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');

      const data: ApiResponse<DashboardStats> = await response.json();
      return data.data;
    },
    enabled: !!user,
  });
}
