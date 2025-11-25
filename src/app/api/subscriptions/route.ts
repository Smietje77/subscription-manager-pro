import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription.service';
import {
  createSubscriptionSchema,
  subscriptionQuerySchema,
} from '@/lib/validations/subscription';
import { supabase } from '@/lib/supabase';

// GET /api/subscriptions - Get all subscriptions for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = subscriptionQuerySchema.parse({
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    });

    const result = await SubscriptionService.getUserSubscriptions(user.id, query);

    return NextResponse.json({
      data: result.data,
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
      },
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch subscriptions',
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createSubscriptionSchema.parse(body);

    const subscription = await SubscriptionService.createSubscription(user.id, validatedData);

    return NextResponse.json({ data: subscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid request data',
            details: error,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to create subscription',
        },
      },
      { status: 500 }
    );
  }
}
