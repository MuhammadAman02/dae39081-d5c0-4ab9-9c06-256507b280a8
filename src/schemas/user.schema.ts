import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const createUserZod = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

const loginUserZod = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const userResponseZod = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipCode: z.string().nullable(),
  country: z.string().nullable(),
  createdAt: z.string(),
});

export const createUserSchema = {
  tags: ["Users"],
  body: zodToJsonSchema(createUserZod),
  response: {
    201: zodToJsonSchema(userResponseZod),
  },
};

export const loginUserSchema = {
  tags: ["Users"],
  body: zodToJsonSchema(loginUserZod),
  response: {
    200: z.object({
      token: z.string(),
      user: userResponseZod,
    }),
  },
};