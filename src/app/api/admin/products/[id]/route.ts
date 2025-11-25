import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';
import { updateProductSchema } from '@/lib/validations/product';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth-helpers';

// PUT /api/admin/products/[id] - Update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateProductSchema.parse(body);

    const product = await ProductService.updateProduct(params.id, validatedData);

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('Error updating product:', error);

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
          message: error instanceof Error ? error.message : 'Failed to update product',
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete a product (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    await ProductService.deleteProduct(params.id);

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete product',
        },
      },
      { status: 500 }
    );
  }
}
