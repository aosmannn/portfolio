'use client';

import { useEffect, useRef, useState } from 'react';

const WIN_LOGO = (
  <svg width="60" height="60" viewBox="0 0 88 88" fill="none">
    <path d="M0 12.4L36 7.2V42H0V12.4Z" fill="#F25022"/>
    <path d="M40 6.6L88 0V42H40V6.6Z" fill="#7FBA00"/>
    <path d="M0 46H36V81L0 75.6V46Z" fill="#00A4EF"/>
    <path d="M40 46H88V88L40 81.4V46Z" fill="#FFB900"/>
  </svg>
);

interface Logo { x: number; y: number; vx: number; vy: number; }

const IDLE_MS = 120_000; // 2 minutes

export default function Screensaver() {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState('');
  const [logos, setLogos] = useState<Logo[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(true), IDLE_MS);
  };

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) { if (animRef.current) clearInterval(animRef.current); return; }

    // Init logos
    const W = window.innerWidth, H = window.innerHeight;
    setLogos(Array.from({ length: 5 }, () => ({
      x: Math.random() * (W - 80),
      y: Math.random() * (H - 80),
      vx: (Math.random() - 0.5) * 3 + (Math.random() > 0.5 ? 1.5 : -1.5),
      vy: (Math.random() - 0.5) * 3 + (Math.random() > 0.5 ? 1.5 : -1.5),
    })));

    // Animate
    animRef.current = setInterval(() => {
      const W = window.innerWidth, H = window.innerHeight;
      setLogos((prev) => prev.map((l) => {
        let { x, y, vx, vy } = l;
        x += vx; y += vy;
        if (x <= 0 || x >= W - 60) { vx = -vx; x = Math.max(0, Math.min(x, W - 60)); }
        if (y <= 0 || y >= H - 60) { vy = -vy; y = Math.max(0, Math.min(y, H - 60)); }
        return { x, y, vx, vy };
      }));
      const now = new Date();
      let h = now.getHours(), m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
      setTime(`${h}:${m} ${ampm}`);
    }, 16);

    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [active]);

  const dismiss = () => { setActive(false); resetTimer(); };

  if (!active) return null;

  return (
    <div
      onClick={dismiss}
      onKeyDown={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.92)',
        cursor: 'none',
      }}
    >
      {logos.map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: l.x, top: l.y, opacity: 0.85 }}>
          {WIN_LOGO}
        </div>
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 72, fontWeight: 200, color: 'rgba(255,255,255,0.15)', fontFamily: 'Tahoma, sans-serif', letterSpacing: -2 }}>
          {time}
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        textAlign: 'center', color: 'rgba(255,255,255,0.3)',
        fontFamily: 'Tahoma, sans-serif', fontSize: 12, pointerEvents: 'none',
      }}>
        Click anywhere to continue...
      </div>
    </div>
  );
}
