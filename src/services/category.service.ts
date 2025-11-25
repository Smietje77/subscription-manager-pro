import { supabase } from '@/lib/supabase';

export class CategoryService {
  /**
   * Get all categories
   */
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return data;
  }

  /**
   * Get a single category by ID or slug
   */
  static async getCategory(identifier: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`id.eq.${identifier},slug.eq.${identifier}`)
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Create a new category (admin only)
   */
  static async createCategory(input: {
    name: string;
    slug: string;
    icon?: string;
    color?: string;
    parentId?: string;
  }) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: input.name,
        slug: input.slug,
        icon: input.icon || null,
        color: input.color || null,
        parent_id: input.parentId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Update a category (admin only)
   */
  static async updateCategory(
    id: string,
    input: {
      name?: string;
      slug?: string;
      icon?: string;
      color?: string;
      parentId?: string;
    }
  ) {
    const updateData: {
      name?: string;
      slug?: string;
      icon?: string | null;
      color?: string | null;
      parent_id?: string | null;
    } = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.icon !== undefined) updateData.icon = input.icon || null;
    if (input.color !== undefined) updateData.color = input.color || null;
    if (input.parentId !== undefined) updateData.parent_id = input.parentId || null;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Delete a category (admin only)
   */
  static async deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  }
}
