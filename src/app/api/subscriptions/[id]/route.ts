import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription.service';
import { updateSubscriptionSchema } from '@/lib/validations/subscription';
import { supabase } from '@/lib/supabase';

// GET /api/subscriptions/[id] - Get a single subscription
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const subscription = await SubscriptionService.getSubscription(params.id, user.id);

    if (!subscription) {
      return NextResponse.json(
        { error: { message: 'Subscription not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch subscription',
        },
      },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions/[id] - Update a subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSubscriptionSchema.parse(body);

    const subscription = await SubscriptionService.updateSubscription(
      params.id,
      user.id,
      validatedData
    );

    return NextResponse.json({ data: subscription });
  } catch (error) {
    console.error('Error updating subscription:', error);

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
          message: error instanceof Error ? error.message : 'Failed to update subscription',
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions/[id] - Delete a subscription
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    await SubscriptionService.deleteSubscription(params.id, user.id);

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete subscription',
        },
      },
      { status: 500 }
    );
  }
}
