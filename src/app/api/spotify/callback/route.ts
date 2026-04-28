import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#05050f;color:#e0f0ff;padding:40px;">
        <h2 style="color:#ff4444;">Spotify Auth Error</h2>
        <p>${error || "No code returned"}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = "https://brave-lederberg-f68f2a.vercel.app/api/spotify/callback";

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#05050f;color:#e0f0ff;padding:40px;">
        <h2 style="color:#ff4444;">Token Exchange Failed</h2>
        <pre>${err}</pre>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const tokens = await tokenRes.json();
  const refreshToken: string = tokens.refresh_token;

  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
  <title>Spotify Auth Success</title>
  <style>
    body { font-family: 'Trebuchet MS', Tahoma, Arial, sans-serif; background: #05050f; color: #e0f0ff; padding: 40px; max-width: 700px; margin: 0 auto; }
    h1 { color: #00e5ff; margin-bottom: 8px; }
    .card { background: rgba(0,200,255,0.05); border: 1px solid rgba(0,200,255,0.3); border-radius: 12px; padding: 24px; margin: 24px 0; }
    .token { background: #000; color: #00e5ff; padding: 16px; border-radius: 8px; font-family: monospace; word-break: break-all; font-size: 13px; border: 1px solid rgba(0,200,255,0.2); }
    .instruction { color: rgba(224,240,255,0.75); font-size: 0.9rem; line-height: 1.7; }
    code { background: rgba(0,200,255,0.1); padding: 2px 6px; border-radius: 4px; color: #00e5ff; }
    .step { margin: 12px 0; }
  </style>
</head>
<body>
  <h1>✓ Spotify Connected!</h1>
  <p class="instruction">Your refresh token is ready. Follow the steps below to finish setup.</p>

  <div class="card">
    <div style="color:#00e5ff;font-weight:bold;margin-bottom:12px;">Your Refresh Token</div>
    <div class="token">${refreshToken}</div>
  </div>

  <div class="card instruction">
    <div class="step">1. Open <code>.env.local</code> in your project root.</div>
    <div class="step">2. Find the line <code>SPOTIFY_REFRESH_TOKEN=</code> and paste the token after the equals sign.</div>
    <div class="step">3. Save the file and restart the dev server with <code>pnpm dev</code>.</div>
    <div class="step">4. The Now Playing widget will appear in the navbar when you&apos;re listening to something on Spotify.</div>
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
