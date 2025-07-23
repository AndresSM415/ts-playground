import { Hono } from 'hono';
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun"
import {expensesRoute} from "./routes/expenses.ts";

const app = new Hono();

app.use('*', logger());

app.route("/api/expenses", expensesRoute)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

setInterval(() => {
    const mem = process.memoryUsage();
    console.log(
        `RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB, Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
    );
}, 60000);

export default app;