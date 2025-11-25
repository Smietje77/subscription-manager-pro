import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('categoryId') || undefined;
    const products = await ProductService.getProducts(categoryId);

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch products',
        },
      },
      { status: 500 }
    );
  }
}
