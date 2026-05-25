import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import auth from './routes/auth';
import categories from './routes/categories';
import reports from './routes/reports';
import admin from './routes/admin';
import news from './routes/news';
import forum from './routes/forum';
import statistics from './routes/statistics';

const app = new Hono();

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.get('/health', (c) =>
  c.json({ status: 'ok', service: 'sura-api', timestamp: new Date().toISOString() })
);

const api = new Hono();
api.route('/auth', auth);
api.route('/categories', categories);
api.route('/reports', reports);
api.route('/admin', admin);
api.route('/news', news);
api.route('/forum', forum);
api.route('/statistics', statistics);

app.route('/api', api);

app.notFound((c) => c.json({ error: 'Endpoint tidak ditemukan' }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Terjadi kesalahan pada server' }, 500);
});

const port = Number(process.env.PORT ?? 3000);

console.log(`Sura API berjalan di http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
