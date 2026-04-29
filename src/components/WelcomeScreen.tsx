'use client';

import { useEffect, useState } from 'react';
import { sounds } from '@/lib/sounds';

export default function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [hovered, setHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
      <div
        onClick={() => setShowNotifications(v => !v)}
        style={{
          position: 'absolute', top: 48, right: 64,
          textAlign: 'right', color: 'white',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          zIndex: 2, cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 200, letterSpacing: -3, lineHeight: 1 }}>{time}</div>
        <div style={{ fontSize: 18, fontWeight: 300, marginTop: 6, opacity: 0.9 }}>{date}</div>
      </div>

      {/* Notification panel */}
      {showNotifications && (
        <div style={{
          position: 'absolute', top: 200, right: 64,
          background: 'rgba(20,30,60,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          padding: '16px 20px',
          minWidth: 240,
          color: 'white',
          zIndex: 3,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
            🔔 Notifications
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
            No new notifications
          </div>
          <button
            onClick={() => setShowNotifications(false)}
            style={{
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              fontSize: 11, padding: '4px 14px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3, color: 'white',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Center: glass login panel */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          padding: '48px 72px 36px',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 6,
          boxShadow: '0 16px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 40px rgba(255,255,255,0.04)',
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
              border: hovered ? '2px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.5)',
              boxShadow: hovered
                ? '0 0 0 3px rgba(100,160,255,0.4), 0 8px 30px rgba(0,0,0,0.5)'
                : '0 4px 20px rgba(0,0,0,0.5)',
              cursor: 'pointer', overflow: 'hidden',
              transition: 'all 0.2s ease',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/adam.jpeg" alt="Adam Osman" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
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

          {/* Password row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 16,
          }}>
            <input
              type="password"
              value="password"
              readOnly
              style={{
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                fontSize: 14, letterSpacing: 4,
                padding: '5px 10px', width: 180,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                color: 'white', outline: 'none',
                backdropFilter: 'blur(4px)',
              }}
            />
            {/* Blue arrow button */}
            <button
              onClick={handleClick}
              style={{
                width: 30, height: 30,
                background: 'linear-gradient(180deg, #4499ee 0%, #0055cc 100%)',
                border: '1px solid rgba(0,80,180,0.8)',
                borderRadius: 3, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,60,160,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                color: 'white', fontSize: 14,
              }}
            >
              ▶
            </button>
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
