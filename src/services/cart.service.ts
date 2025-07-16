import { db } from '../db/client';
import { cartItems, products } from '../db/schema';
import { AppError } from '../utils/AppError';
import { eq, and } from 'drizzle-orm';

export async function addToCart(userId: string, productId: string, quantity: number) {
  // Check if product exists and has enough stock
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product[0]) {
    throw new AppError('Product not found', 404);
  }

  if (product[0].stockQuantity < quantity) {
    throw new AppError('Insufficient stock', 400);
  }

  // Check if item already exists in cart
  const existingItem = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existingItem[0]) {
    // Update quantity
    const result = await db
      .update(cartItems)
      .set({ quantity: existingItem[0].quantity + quantity })
      .where(eq(cartItems.id, existingItem[0].id))
      .returning({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
      });

    return {
      ...result[0],
      product: {
        name: product[0].name,
        price: product[0].price,
        imageUrl: product[0].imageUrl,
      },
    };
  }

  // Add new item to cart
  const result = await db
    .insert(cartItems)
    .values({ userId, productId, quantity })
    .returning({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
    });

  return {
    ...result[0],
    product: {
      name: product[0].name,
      price: product[0].price,
      imageUrl: product[0].imageUrl,
    },
  };
}

export async function getCart(userId: string) {
  return db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      product: {
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
}

export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  const result = await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)))
    .returning({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
    });

  if (!result[0]) {
    throw new AppError('Cart item not found', 404);
  }

  // Get product details
  const product = await db
    .select({
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .where(eq(products.id, result[0].productId))
    .limit(1);

  return {
    ...result[0],
    product: product[0],
  };
}

export async function removeFromCart(userId: string, itemId: string) {
  const result = await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)))
    .returning({ id: cartItems.id });

  if (!result[0]) {
    throw new AppError('Cart item not found', 404);
  }
}