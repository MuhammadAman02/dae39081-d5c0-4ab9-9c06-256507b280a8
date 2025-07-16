import { db } from '../db/client';
import { users } from '../db/schema';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { eq } from 'drizzle-orm';

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    const result = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        address: users.address,
        city: users.city,
        state: users.state,
        zipCode: users.zipCode,
        country: users.country,
        createdAt: users.createdAt,
      });

    return result[0];
  } catch (error: any) {
    if (error?.code === '23505') {
      throw new AppError('Email already exists', 409);
    }
    throw new AppError('Failed to create user');
  }
}

export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user[0]) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValidPassword = await bcrypt.compare(password, user[0].password);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign({ userId: user[0].id }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPassword } = user[0];
  return { token, user: userWithoutPassword };
}