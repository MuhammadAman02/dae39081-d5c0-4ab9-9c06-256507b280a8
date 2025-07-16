import { FastifyInstance } from 'fastify';
import { createCategoryHandler, getCategoriesHandler } from '../controllers/category.controller';
import { createCategorySchema, getCategoriesSchema } from '../schemas/category.schema';

export async function categoryRoutes(app: FastifyInstance) {
  app.post('/api/categories', {
    schema: createCategorySchema,
    handler: createCategoryHandler,
  });

  app.get('/api/categories', {
    schema: getCategoriesSchema,
    handler: getCategoriesHandler,
  });
}