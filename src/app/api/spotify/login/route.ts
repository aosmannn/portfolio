import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI in environment" },
      { status: 500 }
    );
  }

  const scopes = "user-read-currently-playing user-read-playback-state";
  const hardcodedRedirect = "https://brave-lederberg-f68f2a.vercel.app/api/spotify/callback";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: hardcodedRedirect,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
