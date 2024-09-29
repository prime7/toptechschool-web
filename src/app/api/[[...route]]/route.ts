import { Hono } from "hono";
import { handle } from "hono/vercel";
import uploadApp from "./upload";

const app = new Hono().basePath("/api");

app.route("/file-upload", uploadApp);

export const GET = handle(app);
export const POST = handle(app);
