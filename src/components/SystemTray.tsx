'use client';

import { useState } from 'react';

interface TrayIcon { id: string; emoji: string; tooltip: string; }

const ICONS: TrayIcon[] = [
  { id: 'wifi',    emoji: '📶', tooltip: 'Connected' },
  { id: 'volume',  emoji: '🔊', tooltip: '100%' },
  { id: 'battery', emoji: '🔋', tooltip: 'Plugged in' },
];

export default function SystemTray() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
      {ICONS.map(icon => (
        <div key={icon.id} style={{ position: 'relative' }}>
          <div
            onMouseEnter={() => setHovered(icon.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontSize: 14, lineHeight: 1, padding: '0 3px', cursor: 'default',
              opacity: hovered === icon.id ? 1 : 0.8,
            }}
          >
            {icon.emoji}
          </div>
          {hovered === icon.id && (
            <div style={{
              position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
              background: '#1a1a1a', color: '#fff', fontSize: 10,
              padding: '3px 7px', borderRadius: 3, whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              fontFamily: 'Tahoma, sans-serif', zIndex: 9999,
              border: '1px solid #444',
            }}>
              {icon.tooltip}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
