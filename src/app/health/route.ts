// Liveness/readiness probe used by the infrastructure health check.
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("ok", { status: 200, headers: { "content-type": "text/plain" } });
}
