'use client';

import { useEffect, useState } from 'react';

interface BSODProps {
  onDismiss: () => void;
}

export default function BSOD({ onDismiss }: BSODProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Fake collection progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setDone(true); return 100; }
        return p + Math.floor(Math.random() * 3) + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') onDismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  return (
    <div
      onClick={done ? onDismiss : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#0078d7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        cursor: done ? 'pointer' : 'default',
      }}
    >
      <div style={{ maxWidth: 620, padding: '0 40px', color: 'white' }}>
        {/* Sad face */}
        <div style={{ fontSize: 96, marginBottom: 24, lineHeight: 1 }}>:(</div>

        <div style={{ fontSize: 22, fontWeight: 400, marginBottom: 24, lineHeight: 1.4 }}>
          Your PC ran into a problem that it couldn&apos;t handle, and now
          it needs to restart. We&apos;re just collecting some error info,
          and then we&apos;ll restart for you.
        </div>

        <div style={{ fontSize: 28, fontWeight: 300, marginBottom: 32 }}>
          {done ? '100% complete' : `${Math.min(progress, 99)}% complete`}
        </div>

        {/* QR code - scans to LinkedIn */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 32 }}>
          <a
            href="https://www.linkedin.com/in/adamogsu/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDismiss}
            style={{ flexShrink: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fadamogsu%2F&bgcolor=0078d7&color=ffffff&qzone=1"
              alt="LinkedIn QR"
              width={80}
              height={80}
              style={{ borderRadius: 4, display: 'block', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
            />
          </a>
          <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
            For more information about this issue and possible fixes, visit<br/>
            <span style={{ textDecoration: 'underline' }}>https://adamosman.dev</span>
            <br/><br/>
            If you call a support person, give them this info:<br/>
            Stop code: <strong>RECRUITER_NOT_HIRING_FAST_ENOUGH</strong>
          </div>
        </div>

        <div style={{ fontSize: 13, opacity: 0.7, fontStyle: 'italic' }}>
          {done ? 'Scan QR code or click to visit LinkedIn. Press Enter or click to return.' : 'Please do not turn off your portfolio.'}
        </div>
      </div>
    </div>
  );
}
