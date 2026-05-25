import { Hono } from 'hono';
import { asc, eq } from 'drizzle-orm';
import { db } from '../db';
import { categories } from '../db/schema';

const categoriesRoute = new Hono();

categoriesRoute.get('/', async (c) => {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder));

  return c.json(rows);
});

export default categoriesRoute;
