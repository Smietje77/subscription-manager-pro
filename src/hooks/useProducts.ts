import { useQuery } from '@tanstack/react-query';
import type { ProductWithDetails, ApiResponse } from '@/types';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: ApiResponse<ProductWithDetails[]> = await response.json();
      console.log('📦 Products API Response:', data.data);
      console.log('📦 First product structure:', data.data?.[0]);
      return data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - products don't change often
  });
}
