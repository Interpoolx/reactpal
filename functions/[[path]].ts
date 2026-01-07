import app from '../backend/src/index';
import { handle } from 'hono/cloudflare-pages';

export const onRequest = handle(app);
