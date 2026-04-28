import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.toString();
  try {
    const res = await fetch(`https://lrclib.net/api/get?${params}`, {
      headers: { 'Lrclib-Client': 'AdamOsmanPortfolio/1.0' },
      next: { revalidate: 60 },
    });
    if (!res.ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}
