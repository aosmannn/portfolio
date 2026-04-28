export const dynamic = 'force-dynamic';

export async function GET() {
  const res = await fetch('https://api.github.com/users/aosmannn/repos?sort=updated&per_page=12', {
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return Response.json(data);
}
