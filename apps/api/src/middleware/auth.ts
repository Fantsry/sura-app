import { createMiddleware } from 'hono/factory';
import { verifyToken, type JwtPayload } from '../lib/jwt';

export type AuthVariables = {
  user: JwtPayload;
};

export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const header = c.req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
      return c.json({ error: 'Token autentikasi diperlukan' }, 401);
    }

    try {
      const token = header.slice(7);
      const user = await verifyToken(token);
      c.set('user', user);
      await next();
    } catch {
      return c.json({ error: 'Token tidak valid atau kedaluwarsa' }, 401);
    }
  }
);

export const optionalAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const header = c.req.header('Authorization');
    if (header?.startsWith('Bearer ')) {
      try {
        const user = await verifyToken(header.slice(7));
        c.set('user', user);
      } catch {
        // ignore invalid token for optional auth
      }
    }
    await next();
  }
);

export const requireAdmin = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const user = c.get('user');
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      return c.json({ error: 'Akses admin diperlukan' }, 403);
    }
    await next();
  }
);
