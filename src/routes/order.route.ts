import { FastifyInstance } from 'fastify';
import {
  createOrderHandler,
  getOrdersHandler,
  getOrderByIdHandler,
} from '../controllers/order.controller';
import {
  createOrderSchema,
  getOrdersSchema,
  getOrderByIdSchema,
} from '../schemas/order.schema';
import { authenticateToken } from '../middleware/auth';

export async function orderRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticateToken);

  app.post('/api/orders', {
    schema: createOrderSchema,
    handler: createOrderHandler,
  });

  app.get('/api/orders', {
    schema: getOrdersSchema,
    handler: getOrdersHandler,
  });

  app.get('/api/orders/:id', {
    schema: getOrderByIdSchema,
    handler: getOrderByIdHandler,
  });
}