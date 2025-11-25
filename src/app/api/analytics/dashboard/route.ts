import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';
import { supabase } from '@/lib/supabase';

// GET /api/analytics/dashboard - Get dashboard statistics
export async function GET(_request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const stats = await AnalyticsService.getDashboardStats(user.id);

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
        },
      },
      { status: 500 }
    );
  }
}
