import { db } from '../db/client';
import { orders, orderItems, cartItems, products } from '../db/schema';
import { AppError } from '../utils/AppError';
import { eq, and } from 'drizzle-orm';

export async function createOrder(userId: string, shippingData: {
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
}) {
  // Get cart items
  const cart = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: {
        price: products.price,
        stockQuantity: products.stockQuantity,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

  if (cart.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Calculate total amount
  let totalAmount = 0;
  for (const item of cart) {
    if (item.product.stockQuantity < item.quantity) {
      throw new AppError(`Insufficient stock for product ${item.productId}`, 400);
    }
    totalAmount += parseFloat(item.product.price) * item.quantity;
  }

  // Create order
  const orderResult = await db
    .insert(orders)
    .values({
      userId,
      totalAmount: totalAmount.toString(),
      ...shippingData,
    })
    .returning({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingZipCode: orders.shippingZipCode,
      shippingCountry: orders.shippingCountry,
      createdAt: orders.createdAt,
    });

  const order = orderResult[0];

  // Create order items
  const orderItemsData = cart.map(item => ({
    orderId: order.id,
    productId: item.productId,
    quantity: item.quantity,
    price: item.product.price,
  }));

  await db.insert(orderItems).values(orderItemsData);

  // Update product stock
  for (const item of cart) {
    await db
      .update(products)
      .set({ stockQuantity: item.product.stockQuantity - item.quantity })
      .where(eq(products.id, item.productId));
  }

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, userId));

  return getOrderById(order.id);
}

export async function getOrders(userId: string) {
  return db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingZipCode: orders.shippingZipCode,
      shippingCountry: orders.shippingCountry,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, userId));
}

export async function getOrderById(orderId: string) {
  const order = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingState: orders.shippingState,
      shippingZipCode: orders.shippingZipCode,
      shippingCountry: orders.shippingCountry,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order[0]) {
    throw new AppError('Order not found', 404);
  }

  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      product: {
        name: products.name,
        imageUrl: products.imageUrl,
      },
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  return {
    ...order[0],
    items,
  };
}