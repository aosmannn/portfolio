import { NextResponse } from "next/server";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refreshToken) {
    return NextResponse.json(
      { isPlaying: false, notConfigured: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const accessToken = await getAccessToken();

    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.status === 204 || res.status === 404) {
      return NextResponse.json(
        { isPlaying: false },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const song = await res.json();

    if (!song || !song.is_playing) {
      return NextResponse.json(
        { isPlaying: false },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const title: string = song.item?.name ?? "Unknown";
    const artist: string =
      (song.item?.artists as Array<{ name: string }>)
        ?.map((a) => a.name)
        .join(", ") ?? "Unknown";
    const albumArt: string | undefined =
      (song.item?.album?.images as Array<{ url: string }>)?.[0]?.url;
    const songUrl: string | undefined = song.item?.external_urls?.spotify;
    const progress: number = song.progress_ms ?? 0;
    const duration: number = song.item?.duration_ms ?? 0;

    return NextResponse.json(
      { isPlaying: true, title, artist, albumArt, songUrl, progress, duration },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
