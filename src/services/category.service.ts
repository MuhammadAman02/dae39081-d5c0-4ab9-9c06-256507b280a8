import { db } from '../db/client';
import { categories } from '../db/schema';
import { AppError } from '../utils/AppError';

export async function createCategory(categoryData: {
  name: string;
  description?: string;
  imageUrl?: string;
}) {
  try {
    const result = await db
      .insert(categories)
      .values(categoryData)
      .returning({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        imageUrl: categories.imageUrl,
        createdAt: categories.createdAt,
      });

    return result[0];
  } catch (error: any) {
    if (error?.code === '23505') {
      throw new AppError('Category name already exists', 409);
    }
    throw new AppError('Failed to create category');
  }
}

export async function getCategories() {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
      imageUrl: categories.imageUrl,
      createdAt: categories.createdAt,
    })
    .from(categories);
}