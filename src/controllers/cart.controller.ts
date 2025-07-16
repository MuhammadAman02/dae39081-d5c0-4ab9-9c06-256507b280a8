import { FastifyRequest, FastifyReply } from 'fastify';
import { addToCart, getCart, updateCartItem, removeFromCart } from '../services/cart.service';
import { AppError } from '../utils/AppError';

export async function addToCartHandler(
  req: FastifyRequest<{ Body: { productId: string; quantity: number } }>,
  res: FastifyReply
) {
  try {
    const userId = req.user!.userId;
    const cartItem = await addToCart(userId, req.body.productId, req.body.quantity);
    res.status(201).send(cartItem);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getCartHandler(req: FastifyRequest, res: FastifyReply) {
  try {
    const userId = req.user!.userId;
    const cart = await getCart(userId);
    res.status(200).send(cart);
  } catch (error) {
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function updateCartItemHandler(
  req: FastifyRequest<{ Params: { id: string }; Body: { quantity: number } }>,
  res: FastifyReply
) {
  try {
    const userId = req.user!.userId;
    const cartItem = await updateCartItem(userId, req.params.id, req.body.quantity);
    res.status(200).send(cartItem);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function removeFromCartHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const userId = req.user!.userId;
    await removeFromCart(userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}