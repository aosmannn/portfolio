export const dynamic = 'force-dynamic';
export async function GET() {
  const key = process.env.WAKATIME_API_KEY;
  if (!key) {
    return Response.json({ error: 'no key' }, { status: 500 });
  }
  const encoded = Buffer.from(key + ':').toString('base64');
  const [statsRes, langsRes] = await Promise.all([
    fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      headers: { 'Authorization': `Basic ${encoded}` },
    }),
    fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      headers: { 'Authorization': `Basic ${encoded}` },
    }),
  ]);
  const stats = await statsRes.json();
  return Response.json(stats);
}
