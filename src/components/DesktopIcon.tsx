'use client';

import { useEffect, useRef, useState } from 'react';
import { sounds } from '@/lib/sounds';

interface DesktopIconProps {
  label: string;
  emoji: string;
  defaultX?: number;
  defaultY?: number;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ label, emoji, defaultX = 10, defaultY = 20, onDoubleClick }: DesktopIconProps) {
  const storageKey = `icon-pos-${label}`;

  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return { x: defaultX, y: defaultY };
  });

  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragStart = useRef<{ mx: number; my: number; ix: number; iy: number } | null>(null);
  const hasDragged = useRef(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClick = useRef(0);

  // Persist position
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(pos)); } catch { /* ignore */ }
  }, [pos, storageKey]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    hasDragged.current = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, ix: pos.x, iy: pos.y };
    setSelected(true);

    const onMove = (me: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = me.clientX - dragStart.current.mx;
      const dy = me.clientY - dragStart.current.my;
      if (!hasDragged.current && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      hasDragged.current = true;
      setDragging(true);
      const newX = Math.max(0, Math.min(window.innerWidth - 72, dragStart.current.ix + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStart.current.iy + dy));
      setPos({ x: newX, y: newY });
    };

    const onUp = () => {
      dragStart.current = null;
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDragged.current) return;
    const now = Date.now();
    if (now - lastClick.current < 400) {
      // double-click
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      lastClick.current = 0;
      sounds.open();
      onDoubleClick();
    } else {
      lastClick.current = now;
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      clickTimeout.current = setTimeout(() => { lastClick.current = 0; }, 400);
    }
  };

  return (
    <div
      className={`desktop-icon${selected ? ' selected' : ''}`}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        cursor: dragging ? 'grabbing' : 'default',
        opacity: dragging ? 0.75 : 1,
        zIndex: dragging ? 9500 : undefined,
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onBlur={() => setSelected(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { sounds.open(); onDoubleClick(); }
      }}
    >
      <div className="desktop-icon-img">{emoji}</div>
      <div className="desktop-icon-label">{label}</div>
    </div>
  );
}
