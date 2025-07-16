import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const addToCartZod = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const updateCartItemZod = z.object({
  quantity: z.number().int().positive(),
});

const cartItemResponseZod = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number(),
  product: z.object({
    name: z.string(),
    price: z.string(),
    imageUrl: z.string().nullable(),
  }),
  createdAt: z.string(),
});

export const addToCartSchema = {
  tags: ["Cart"],
  body: zodToJsonSchema(addToCartZod),
  response: {
    201: zodToJsonSchema(cartItemResponseZod),
  },
};

export const getCartSchema = {
  tags: ["Cart"],
  response: {
    200: zodToJsonSchema(z.array(cartItemResponseZod)),
  },
};

export const updateCartItemSchema = {
  tags: ["Cart"],
  params: zodToJsonSchema(z.object({ id: z.string().uuid() })),
  body: zodToJsonSchema(updateCartItemZod),
  response: {
    200: zodToJsonSchema(cartItemResponseZod),
  },
};

export const removeFromCartSchema = {
  tags: ["Cart"],
  params: zodToJsonSchema(z.object({ id: z.string().uuid() })),
  response: {
    204: z.object({}),
  },
};