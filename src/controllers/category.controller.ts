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
    const category = await createCategory(req.body);
    res.status(201).send(category);
  } catch (error) {
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
    const categories = await getCategories();
    res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ error: 'Internal server error' });
  }
}