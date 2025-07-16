import { FastifyRequest, FastifyReply } from 'fastify';
import { createCategory, getCategories } from '../services/category.service';
import { AppError } from '../utils/AppError';

export async function createCategoryHandler(
  req: FastifyRequest<{
    Body: { name: string; description?: string; imageUrl?: string };
  }>,
  res: FastifyReply
) {
  try {
    console.log('Creating category with data:', req.body);
    const category = await createCategory(req.body);
    console.log('Category created successfully:', category);
    res.status(201).send(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getCategoriesHandler(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    console.log('Fetching categories');
    const categories = await getCategories();
    console.log('Categories fetched successfully:', categories.length);
    res.status(200).send(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).send({ error: 'Internal server error' });
  }
}