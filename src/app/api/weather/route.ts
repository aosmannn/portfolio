import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const geoUrl = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';

    const geo = await fetch(geoUrl, {
      headers: { 'User-Agent': 'AdamOsmanPortfolio/1.0' },
    }).then(r => r.json());

    const lat = geo.latitude ?? 33.749;
    const lon = geo.longitude ?? -84.388;
    const city = geo.city ?? 'Atlanta';
    const region = geo.region_code ?? geo.region ?? '';

    const wx = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,windspeed_10m,` +
      `relative_humidity_2m,precipitation,uv_index` +
      `&temperature_unit=fahrenheit&windspeed_unit=mph`,
    ).then(r => r.json());

    const c = wx.current;
    return NextResponse.json({
      temp: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      code: c.weather_code,
      wind: Math.round(c.windspeed_10m),
      humidity: Math.round(c.relative_humidity_2m),
      precip: Math.round(c.precipitation * 100) / 100,
      uv: Math.round(c.uv_index ?? 0),
      city,
      region,
    });
  } catch {
    return NextResponse.json({ temp: 72, feelsLike: 70, code: 0, wind: 5, humidity: 55, precip: 0, uv: 3, city: 'Atlanta', region: 'GA' });
  }
}
