'use client';

import { useEffect, useState } from 'react';
import { sounds } from '@/lib/sounds';

export default function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function handleClick() {
    sounds.click();
    setTimeout(() => onEnter(), 200);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      fontFamily: 'Segoe UI, Tahoma, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Windows 7 aero.jpg background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('/aero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
      {/* Slight dark overlay for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }} />

      {/* Clock — top right */}
      <div style={{
        position: 'absolute', top: 48, right: 64,
        textAlign: 'right', color: 'white',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        zIndex: 2,
      }}>
        <div style={{ fontSize: 72, fontWeight: 200, letterSpacing: -3, lineHeight: 1 }}>{time}</div>
        <div style={{ fontSize: 18, fontWeight: 300, marginTop: 6, opacity: 0.9 }}>{date}</div>
      </div>

      {/* Center: glass login panel */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          padding: '40px 60px 32px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4,
          boxShadow: '0 8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          {/* Avatar */}
          <div
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: 100, height: 100, borderRadius: 4,
              background: hovered
                ? 'linear-gradient(135deg, #2a80ff 0%, #1050c0 100%)'
                : 'linear-gradient(135deg, #1a60e0 0%, #0a3890 100%)',
              border: hovered ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.5)',
              boxShadow: hovered
                ? '0 0 0 3px rgba(100,160,255,0.4), 0 8px 30px rgba(0,0,0,0.5)'
                : '0 4px 20px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 52, cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
            }}
          >
            🧑‍💻
          </div>

          {/* Name */}
          <div style={{
            color: 'white', fontSize: 20, fontWeight: 300,
            marginTop: 16, letterSpacing: 0.3,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}>
            Adam Osman
          </div>

          {/* Hint */}
          <div style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            marginTop: 4, fontStyle: 'italic',
          }}>
            {hovered ? 'Logging on...' : 'Click to log on'}
          </div>

          {/* Divider */}
          <div style={{
            width: '100%', height: 1,
            background: 'rgba(255,255,255,0.1)',
            margin: '24px 0 16px',
          }} />

          {/* Switch User button */}
          <button style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2, color: 'rgba(255,255,255,0.75)',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            fontSize: 12, padding: '5px 24px',
            cursor: 'default', letterSpacing: 0.3,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            Switch User
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 24px',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 2,
      }}>
        {/* Win7 logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12.4L36 7.2V42H0V12.4Z" fill="#F25022"/>
            <path d="M40 6.6L88 0V42H40V6.6Z" fill="#7FBA00"/>
            <path d="M0 46H36V81L0 75.6V46Z" fill="#00A4EF"/>
            <path d="M40 46H88V88L40 81.4V46Z" fill="#FFB900"/>
          </svg>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 300, fontStyle: 'italic' }}>
              <span style={{ fontWeight: 600 }}>Windows</span> 7
            </div>
          </div>
        </div>

        {/* Power + accessibility */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ icon: '♿', title: 'Ease of Access' }, { icon: '⏻', title: 'Shut down' }].map(({ icon, title }) => (
            <button key={title} title={title} style={{
              width: 30, height: 30,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 2, color: 'rgba(255,255,255,0.7)',
              fontSize: 14, cursor: 'default',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{icon}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
