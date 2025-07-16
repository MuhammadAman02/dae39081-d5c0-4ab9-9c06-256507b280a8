import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const createOrderZod = z.object({
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingState: z.string().min(1),
  shippingZipCode: z.string().min(1),
  shippingCountry: z.string().min(1),
});

const orderItemResponseZod = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number(),
  price: z.string(),
  product: z.object({
    name: z.string(),
    imageUrl: z.string().nullable(),
  }),
});

const orderResponseZod = z.object({
  id: z.string().uuid(),
  status: z.string(),
  totalAmount: z.string(),
  shippingAddress: z.string(),
  shippingCity: z.string(),
  shippingState: z.string(),
  shippingZipCode: z.string(),
  shippingCountry: z.string(),
  createdAt: z.string(),
  items: z.array(orderItemResponseZod),
});

export const createOrderSchema = {
  tags: ["Orders"],
  body: zodToJsonSchema(createOrderZod),
  response: {
    201: zodToJsonSchema(orderResponseZod),
  },
};

export const getOrdersSchema = {
  tags: ["Orders"],
  response: {
    200: zodToJsonSchema(z.array(orderResponseZod)),
  },
};

export const getOrderByIdSchema = {
  tags: ["Orders"],
  params: zodToJsonSchema(z.object({ id: z.string().uuid() })),
  response: {
    200: zodToJsonSchema(orderResponseZod),
  },
};