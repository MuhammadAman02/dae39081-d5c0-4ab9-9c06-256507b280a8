import { FastifyInstance } from 'fastify';
import {
  addToCartHandler,
  getCartHandler,
  updateCartItemHandler,
  removeFromCartHandler,
} from '../controllers/cart.controller';
import {
  addToCartSchema,
  getCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from '../schemas/cart.schema';
import { authenticateToken } from '../middleware/auth';

export async function cartRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticateToken);

  app.post('/api/cart', {
    schema: addToCartSchema,
    handler: addToCartHandler,
  });

  app.get('/api/cart', {
    schema: getCartSchema,
    handler: getCartHandler,
  });

  app.put('/api/cart/:id', {
    schema: updateCartItemSchema,
    handler: updateCartItemHandler,
  });

  app.delete('/api/cart/:id', {
    schema: removeFromCartSchema,
    handler: removeFromCartHandler,
  });
}