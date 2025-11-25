import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';
import { createProductSchema } from '@/lib/validations/product';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';

// POST /api/admin/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const product = await ProductService.createProduct(validatedData);

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);

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
          message: error instanceof Error ? error.message : 'Failed to create product',
        },
      },
      { status: 500 }
    );
  }
}
