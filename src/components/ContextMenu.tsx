'use client';

import { useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  action: () => void;
  divider?: false;
}
interface Divider { divider: true }
type Item = MenuItem | Divider;

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenAbout: () => void;
  onBSOD?: () => void;
  onStickyNote?: () => void;
}

export default function ContextMenu({ x, y, onClose, onOpenAbout, onBSOD, onStickyNote }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if ('key' in e && e.key !== 'Escape') return;
      onClose();
    };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', close);
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('keydown', close); };
  }, [onClose]);

  // Clamp to viewport
  const menuW = 200, menuH = 280;
  const cx = typeof window !== 'undefined' ? Math.min(x, window.innerWidth - menuW - 8) : x;
  const cy = typeof window !== 'undefined' ? Math.min(y, window.innerHeight - menuH - 48) : y;

  const items: Item[] = [
    { label: '🔄  Refresh', action: () => window.location.reload() },
    { label: '📐  Sort Icons', action: () => {} },
    { divider: true },
    { label: '📝  New Sticky Note', action: () => { onStickyNote?.(); onClose(); } },
    { label: '📝  New Blog Post', action: () => window.open('/admin', '_blank') },
    { label: '👤  GitHub Profile', action: () => window.open('https://github.com/aosmannn', '_blank') },
    { divider: true },
    { label: 'ℹ️  About Windows 7', action: () => { onOpenAbout(); onClose(); } },
    { label: '💀  Force BSOD', action: () => { onBSOD?.(); } },
  ];

  return (
    <div
      ref={ref}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: cx,
        top: cy,
        width: menuW,
        background: 'rgba(245,248,255,0.96)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100,140,220,0.5)',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        zIndex: 9800,
        padding: '3px 0',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: 12,
      }}
    >
      {items.map((item, i) =>
        'divider' in item ? (
          <div key={i} style={{ height: 1, background: 'rgba(100,140,220,0.25)', margin: '3px 6px' }} />
        ) : (
          <div
            key={i}
            onClick={() => { item.action(); onClose(); }}
            style={{ padding: '5px 16px', cursor: 'default', color: '#001060', borderRadius: 2, transition: 'background 0.1s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0078d7'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#001060'; }}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
}
