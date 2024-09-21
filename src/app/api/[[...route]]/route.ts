import { Hono } from "hono";
import { handle } from "hono/vercel";
// import authApp from "./auth";
import basicApp from "./basic";
import resumeApp from "./resume";

const app = new Hono().basePath("/api");

// app.route("/auth", authApp);
app.route("/", basicApp);
app.route("/resume", resumeApp);

export const GET = handle(app);
export const POST = handle(app);
