import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, or } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { hashPassword, verifyPassword } from '../lib/password';
import { signToken } from '../lib/jwt';
import { serializeUser } from '../lib/serializers';
import { requireAuth, type AuthVariables } from '../middleware/auth';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2).max(255),
  phoneNumber: z.string().max(20).optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const auth = new Hono<{ Variables: AuthVariables }>();

auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const body = c.req.valid('json');

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.email, body.email), eq(users.username, body.username)))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: 'Email atau username sudah terdaftar' }, 409);
  }

  const passwordHash = await hashPassword(body.password);
  const [created] = await db
    .insert(users)
    .values({
      username: body.username,
      email: body.email,
      passwordHash,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      role: 'user',
    })
    .returning();

  const token = await signToken({
    sub: created.id,
    email: created.email,
    role: created.role ?? 'user',
  });

  return c.json(
    {
      token,
      user: serializeUser(created, true),
    },
    201
  );
});

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { identifier, password } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.username, identifier)))
    .limit(1);

  if (!user || !user.isActive) {
    return c.json({ error: 'Kredensial tidak valid' }, 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return c.json({ error: 'Kredensial tidak valid' }, 401);
  }

  await db
    .update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, user.id));

  const token = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role ?? 'user',
  });

  return c.json({
    token,
    user: serializeUser(user, true),
  });
});

auth.get('/me', requireAuth, async (c) => {
  const jwtUser = c.get('user');
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, jwtUser.sub))
    .limit(1);

  if (!user || !user.isActive) {
    return c.json({ error: 'Pengguna tidak ditemukan' }, 404);
  }

  return c.json(serializeUser(user, true));
});

export default auth;
