export async function GET() {
  return new Response(JSON.stringify({ campaigns: [] }), { headers: { 'content-type': 'application/json' } });
}


