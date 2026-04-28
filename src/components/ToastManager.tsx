'use client';

import { useEffect, useState } from 'react';
import { toastEmitter } from '@/lib/toast';

interface Toast {
  id: number;
  title: string;
  body: string;
  icon?: string;
}

let nextId = 0;

export default function ToastManager() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsub = toastEmitter.subscribe((msg) => {
      const id = ++nextId;
      setToasts((prev) => [...prev.slice(-2), { id, ...msg }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    });
    return unsub;
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 50,
      right: 12,
      zIndex: 9500,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          width: 300,
          background: 'rgba(220,235,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: 6,
          boxShadow: '0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(40,100,200,0.25)',
          overflow: 'hidden',
          animation: 'toast-in 0.25s ease',
          pointerEvents: 'all',
        }}>
          {/* Win7 blue header strip */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(40,100,220,0.7) 0%, rgba(20,70,180,0.8) 100%)',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 88 88" fill="none">
              <path d="M0 12.4L36 7.2V42H0V12.4Z" fill="#F25022"/>
              <path d="M40 6.6L88 0V42H40V6.6Z" fill="#7FBA00"/>
              <path d="M0 46H36V81L0 75.6V46Z" fill="#00A4EF"/>
              <path d="M40 46H88V88L40 81.4V46Z" fill="#FFB900"/>
            </svg>
            <span style={{ color: 'white', fontSize: 10, fontFamily: 'Tahoma, sans-serif', fontWeight: 'bold', letterSpacing: 0.2 }}>
              {t.title}
            </span>
          </div>
          {/* Body */}
          <div style={{ padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
            {t.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.icon} alt="" style={{ width: 36, height: 36, borderRadius: 3, flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 11, fontFamily: 'Tahoma, sans-serif', color: '#001060', lineHeight: 1.4 }}>
              {t.body}
            </span>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes toast-in {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
