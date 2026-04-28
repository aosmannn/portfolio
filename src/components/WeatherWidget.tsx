'use client';

import { useEffect, useState } from 'react';
import { showToast } from '@/lib/toast';

const WX: Record<number, [string, string]> = {
  0: ['☀️', 'Clear sky'], 1: ['🌤️', 'Mainly clear'], 2: ['⛅', 'Partly cloudy'],
  3: ['☁️', 'Overcast'], 45: ['🌫️', 'Foggy'], 48: ['🌫️', 'Icy fog'],
  51: ['🌦️', 'Light drizzle'], 53: ['🌧️', 'Drizzle'], 55: ['🌧️', 'Heavy drizzle'],
  61: ['🌧️', 'Light rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Heavy rain'],
  71: ['❄️', 'Light snow'], 73: ['❄️', 'Snow'], 75: ['❄️', 'Heavy snow'],
  80: ['🌦️', 'Rain showers'], 81: ['🌧️', 'Showers'], 82: ['⛈️', 'Heavy showers'],
  95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm+hail'], 99: ['⛈️', 'Severe storm'],
};

interface WeatherData {
  temp: number; feelsLike: number; code: number;
  wind: number; humidity: number; precip: number; uv: number;
  city: string; region: string;
}

function wxInfo(code: number): [string, string] {
  return WX[code] ?? ['🌡️', 'Unknown'];
}

function uvLabel(uv: number) {
  if (uv <= 2) return { label: 'Low', color: '#4caf50' };
  if (uv <= 5) return { label: 'Moderate', color: '#ffeb3b' };
  if (uv <= 7) return { label: 'High', color: '#ff9800' };
  if (uv <= 10) return { label: 'Very High', color: '#f44336' };
  return { label: 'Extreme', color: '#9c27b0' };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data: WeatherData = await fetch('/api/weather').then(r => r.json());
        if (cancelled) return;
        setWeather(data);
        const [emoji, desc] = wxInfo(data.code);
        showToast({ title: `${emoji} Weather`, body: `${data.city}: ${data.temp}°F — ${desc}` });
      } catch { /* silently fail */ }
    }
    load();
    const interval = setInterval(load, 10 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (!weather) return null;

  const [emoji, desc] = wxInfo(weather.code);
  const uv = uvLabel(weather.uv);

  return (
    <div style={{
      position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
      zIndex: 60, fontFamily: 'Tahoma, sans-serif', userSelect: 'none',
    }}>
      {/* Main pill */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: expanded ? '8px 8px 0 0' : 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          padding: '5px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
      >
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
            {weather.city}{weather.region ? `, ${weather.region}` : ''}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(200,220,255,0.9)' }}>
            {weather.temp}°F · {desc}
          </div>
        </div>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginLeft: 2 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          padding: '10px 14px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px 16px',
          minWidth: 200,
        }}>
          {[
            { icon: '🌡️', label: 'Feels like', value: `${weather.feelsLike}°F` },
            { icon: '💧', label: 'Humidity', value: `${weather.humidity}%` },
            { icon: '💨', label: 'Wind', value: `${weather.wind} mph` },
            { icon: '🌧️', label: 'Precip', value: `${weather.precip} in` },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 9, color: 'rgba(180,200,255,0.6)' }}>{label}</div>
                <div style={{ fontSize: 11, color: 'white', fontWeight: 'bold' }}>{value}</div>
              </div>
            </div>
          ))}

          {/* UV index full width */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: 13 }}>☀️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: 'rgba(180,200,255,0.6)' }}>UV Index</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'white', fontWeight: 'bold' }}>{weather.uv}</div>
                <span style={{ fontSize: 10, color: uv.color, fontWeight: 'bold' }}>{uv.label}</span>
              </div>
            </div>
            {/* UV bar */}
            <div style={{ width: 60, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (weather.uv / 11) * 100)}%`, background: uv.color, borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
