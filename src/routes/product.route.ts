import { FastifyInstance } from 'fastify';
import {
  createProductHandler,
  getProductsHandler,
  getProductByIdHandler,
} from '../controllers/product.controller';
import {
  createProductSchema,
  getProductsSchema,
  getProductByIdSchema,
} from '../schemas/product.schema';

export async function productRoutes(app: FastifyInstance) {
  app.post('/api/products', {
    schema: createProductSchema,
    handler: createProductHandler,
  });

  app.get('/api/products', {
    schema: getProductsSchema,
    handler: getProductsHandler,
  });

  app.get('/api/products/:id', {
    schema: getProductByIdSchema,
    handler: getProductByIdHandler,
  });
}