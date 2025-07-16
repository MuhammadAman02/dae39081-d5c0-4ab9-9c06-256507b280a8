import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const createCategoryZod = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

const categoryResponseZod = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
});

export const createCategorySchema = {
  tags: ["Categories"],
  body: zodToJsonSchema(createCategoryZod),
  response: {
    201: zodToJsonSchema(categoryResponseZod),
  },
};

export const getCategoriesSchema = {
  tags: ["Categories"],
  response: {
    200: zodToJsonSchema(z.array(categoryResponseZod)),
  },
};