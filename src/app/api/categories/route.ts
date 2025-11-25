import { NextResponse } from 'next/server';
import { CategoryService } from '@/services/category.service';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await CategoryService.getCategories();

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch categories',
        },
      },
      { status: 500 }
    );
  }
}
