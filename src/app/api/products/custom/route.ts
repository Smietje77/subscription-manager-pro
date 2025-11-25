import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productName, planName, amount, currency, interval } = body;

    // Validate required fields
    if (!productName || !planName || amount === undefined || !currency || !interval) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from product name
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 1. Create the custom product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: productName,
        slug: `${slug}-${Date.now()}`, // Make slug unique
        description: {},
        category_id: '00000000-0000-0000-0000-000000000000', // Default category or you may want to create a "Custom" category
        is_active: true,
        logo_url: null,
        website_url: null,
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      throw new Error('Failed to create product');
    }

    // 2. Create the plan
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .insert({
        product_id: product.id,
        name: planName,
        description: null,
        features: [],
      })
      .select()
      .single();

    if (planError) {
      console.error('Error creating plan:', planError);
      // Rollback: delete the product
      await supabase.from('products').delete().eq('id', product.id);
      throw new Error('Failed to create plan');
    }

    // 3. Create the price
    const { data: price, error: priceError } = await supabase
      .from('prices')
      .insert({
        plan_id: plan.id,
        amount: Number(amount),
        currency: currency,
        interval: interval,
        is_active: true,
      })
      .select()
      .single();

    if (priceError) {
      console.error('Error creating price:', priceError);
      // Rollback: delete plan and product
      await supabase.from('plans').delete().eq('id', plan.id);
      await supabase.from('products').delete().eq('id', product.id);
      throw new Error('Failed to create price');
    }

    return NextResponse.json({
      data: {
        productId: product.id,
        planId: plan.id,
        priceId: price.id,
        message: 'Custom product created successfully',
      },
    });
  } catch (error) {
    console.error('Error in custom product creation:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to create custom product',
        },
      },
      { status: 500 }
    );
  }
}
