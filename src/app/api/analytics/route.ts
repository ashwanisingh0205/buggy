export async function GET() {
  return new Response(JSON.stringify({ metrics: {} }), { headers: { 'content-type': 'application/json' } });
}


