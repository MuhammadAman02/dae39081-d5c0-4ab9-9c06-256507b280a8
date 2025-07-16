import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser, loginUser } from '../services/user.service';
import { AppError } from '../utils/AppError';

export async function createUserHandler(
  req: FastifyRequest<{
    Body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  }>,
  res: FastifyReply
) {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function loginUserHandler(
  req: FastifyRequest<{ Body: { email: string; password: string } }>,
  res: FastifyReply
) {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    res.status(200).send(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}