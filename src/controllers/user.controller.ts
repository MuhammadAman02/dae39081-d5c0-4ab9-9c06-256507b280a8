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
    console.log('Creating user with data:', { ...req.body, password: '[REDACTED]' });
    const user = await createUser(req.body);
    console.log('User created successfully:', user);
    res.status(201).send(user);
  } catch (error) {
    console.error('Error creating user:', error);
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
    console.log('Login attempt for email:', req.body.email);
    const result = await loginUser(req.body.email, req.body.password);
    console.log('Login successful for user:', result.user.id);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error during login:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}