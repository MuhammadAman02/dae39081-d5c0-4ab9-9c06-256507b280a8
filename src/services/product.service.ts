import { db } from '../db/client';
import { products, categories } from '../db/schema';
import { AppError } from '../utils/AppError';
import { eq, and, ilike } from 'drizzle-orm';

export async function createProduct(productData: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sku: string;
  stockQuantity: number;
  imageUrl?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
}) {
  try {
    const result = await db
      .insert(products)
      .values(productData)
      .returning({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        categoryId: products.categoryId,
        sku: products.sku,
        stockQuantity: products.stockQuantity,
        imageUrl: products.imageUrl,
        dimensions: products.dimensions,
        weight: products.weight,
        material: products.material,
        color: products.color,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      });

    return result[0];
  } catch (error: any) {
    if (error?.code === '23505') {
      throw new AppError('SKU already exists', 409);
    }
    throw new AppError('Failed to create product');
  }
}

export async function getProducts(
  page: number,
  limit: number,
  categoryId?: string,
  search?: string
) {
  const offset = (page - 1) * limit;
  let query = db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      categoryId: products.categoryId,
      sku: products.sku,
      stockQuantity: products.stockQuantity,
      imageUrl: products.imageUrl,
      dimensions: products.dimensions,
      weight: products.weight,
      material: products.material,
      color: products.color,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.isActive, true));

  if (categoryId) {
    query = query.where(and(eq(products.isActive, true), eq(products.categoryId, categoryId)));
  }

  if (search) {
    query = query.where(
      and(
        eq(products.isActive, true),
        ilike(products.name, `%${search}%`)
      )
    );
  }

  return query.limit(limit).offset(offset);
}

export async function getProductById(id: string) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      categoryId: products.categoryId,
      sku: products.sku,
      stockQuantity: products.stockQuantity,
      imageUrl: products.imageUrl,
      dimensions: products.dimensions,
      weight: products.weight,
      material: products.material,
      color: products.color,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(and(eq(products.id, id), eq(products.isActive, true)))
    .limit(1);

  if (!result[0]) {
    throw new AppError('Product not found', 404);
  }

  return result[0];
}