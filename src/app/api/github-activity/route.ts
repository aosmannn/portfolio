export const dynamic = 'force-dynamic';
export async function GET() {
  const res = await fetch('https://api.github.com/users/aosmannn/events/public?per_page=15', {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'adamosman-portfolio' },
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return Response.json(data);
}
