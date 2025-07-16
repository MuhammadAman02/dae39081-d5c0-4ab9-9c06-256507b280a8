import { FastifyRequest, FastifyReply } from 'fastify';
import { createOrder, getOrders, getOrderById } from '../services/order.service';
import { AppError } from '../utils/AppError';

export async function createOrderHandler(
  req: FastifyRequest<{
    Body: {
      shippingAddress: string;
      shippingCity: string;
      shippingState: string;
      shippingZipCode: string;
      shippingCountry: string;
    };
  }>,
  res: FastifyReply
) {
  try {
    const userId = req.user!.userId;
    const order = await createOrder(userId, req.body);
    res.status(201).send(order);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getOrdersHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user!.userId;
    const orders = await getOrders(userId);
    res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getOrderByIdHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const order = await getOrderById(req.params.id);
    res.status(200).send(order);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}