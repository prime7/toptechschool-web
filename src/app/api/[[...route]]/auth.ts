import { Hono } from "hono";
import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

const authApp = new Hono();

authApp.all("/*", async (c) => {
  const method = c.req.method;

  const nextRequest = new NextRequest(c.req.url, {
    method: method,
    headers: c.req.raw.headers,
    body:
      method !== "GET" && method !== "HEAD"
        ? await c.req.arrayBuffer()
        : undefined,
  });

  const response = await (method === "GET" ? handlers.GET : handlers.POST)(
    nextRequest
  );

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

export default authApp;
