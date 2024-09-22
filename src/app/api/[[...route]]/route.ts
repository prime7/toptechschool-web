import { Hono } from "hono";
import { handle } from "hono/vercel";
// import authApp from "./auth";
import basicApp from "./basic";
import resumeApp from "./resume";
import uploadApp from "./upload";

const app = new Hono().basePath("/api");

// app.route("/auth", authApp);
app.route("/", basicApp);
app.route("/resume", resumeApp);
app.route("/file-upload", uploadApp);

export const GET = handle(app);
export const POST = handle(app);
