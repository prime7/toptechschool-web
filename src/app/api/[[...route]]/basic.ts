import { Hono } from "hono";

const basicApp = new Hono();

basicApp.get("/hello", (c) => {
  return c.json({ message: "Hello Next.js!" });
});

export default basicApp;
