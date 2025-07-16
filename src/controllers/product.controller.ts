import { FastifyRequest, FastifyReply } from 'fastify';
import { createProduct, getProducts, getProductById } from '../services/product.service';
import { AppError } from '../utils/AppError';

export async function createProductHandler(
  req: FastifyRequest<{
    Body: {
      name: string;
      description: string;
      price: number;
      categoryId: string;
      sku: string;
      stockQuantity: number;
      imageUrl?: string;
      dimensions?: string;
      weight?: string;
      material?: string;
      color?: string;
    };
  }>,
  res: FastifyReply
) {
  try {
    const product = await createProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getProductsHandler(
  req: FastifyRequest<{
    Querystring: { page: number; limit: number; categoryId?: string; search?: string };
  }>,
  res: FastifyReply
) {
  try {
    const products = await getProducts(
      req.query.page,
      req.query.limit,
      req.query.categoryId,
      req.query.search
    );
    res.status(200).send(products);
  } catch (error) {
    return res.status(500).send({ error: 'Internal server error' });
  }
}

export async function getProductByIdHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: 'Internal server error' });
  }
}