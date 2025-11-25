import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';

// GET /api/admin/stats - Get admin statistics (admin only)
export async function GET(_request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    const stats = await AnalyticsService.getAdminStats();

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch admin stats',
        },
      },
      { status: 500 }
    );
  }
}
