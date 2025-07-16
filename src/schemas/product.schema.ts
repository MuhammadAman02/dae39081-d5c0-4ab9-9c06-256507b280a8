import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const createProductZod = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  sku: z.string().min(1),
  stockQuantity: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
});

const getProductsQueryZod = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
});

const productResponseZod = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  categoryId: z.string().uuid(),
  sku: z.string(),
  stockQuantity: z.number(),
  imageUrl: z.string().nullable(),
  dimensions: z.string().nullable(),
  weight: z.string().nullable(),
  material: z.string().nullable(),
  color: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createProductSchema = {
  tags: ["Products"],
  body: zodToJsonSchema(createProductZod),
  response: {
    201: zodToJsonSchema(productResponseZod),
  },
};

export const getProductsSchema = {
  tags: ["Products"],
  querystring: zodToJsonSchema(getProductsQueryZod),
  response: {
    200: zodToJsonSchema(z.array(productResponseZod)),
  },
};

export const getProductByIdSchema = {
  tags: ["Products"],
  params: zodToJsonSchema(z.object({ id: z.string().uuid() })),
  response: {
    200: zodToJsonSchema(productResponseZod),
  },
};