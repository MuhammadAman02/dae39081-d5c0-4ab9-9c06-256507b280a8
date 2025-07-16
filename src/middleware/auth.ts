import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export async function authenticateToken(req: FastifyRequest, res: FastifyReply) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId };
  } catch (error) {
    return res.status(403).send({ error: 'Invalid token' });
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: { userId: string };
  }
}