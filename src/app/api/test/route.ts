import { inngest } from "@/lib/ingest/client";

export async function POST(req: Request) {
  const { name, data } = await req.json();
  await inngest.send({ name, data });
  return new Response("Event sent");
}