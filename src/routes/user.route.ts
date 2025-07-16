import { FastifyInstance } from 'fastify';
import { createUserHandler, loginUserHandler } from '../controllers/user.controller';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';

export async function userRoutes(app: FastifyInstance) {
  app.post('/api/users/register', {
    schema: createUserSchema,
    handler: createUserHandler,
  });

  app.post('/api/users/login', {
    schema: loginUserSchema,
    handler: loginUserHandler,
  });
}