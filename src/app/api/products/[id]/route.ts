import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';

// GET /api/products/[id] - Get a single product
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await ProductService.getProduct(params.id);

    if (!product) {
      return NextResponse.json(
        { error: { message: 'Product not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch product',
        },
      },
      { status: 500 }
    );
  }
}
