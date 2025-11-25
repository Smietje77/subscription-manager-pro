import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';
import { supabase } from '@/lib/supabase';

// GET /api/analytics/spending - Get spending by category
export async function GET(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const type = request.nextUrl.searchParams.get('type') || 'category';

    let data;
    if (type === 'trend') {
      data = await AnalyticsService.getSpendingTrend(user.id);
    } else {
      data = await AnalyticsService.getSpendingByCategory(user.id);
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching spending analytics:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch spending analytics',
        },
      },
      { status: 500 }
    );
  }
}
