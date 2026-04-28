'use client';

import { useEffect, useRef, useState } from 'react';
import { sounds } from '@/lib/sounds';

interface WindowProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  zIndex: number;
  onFocus: () => void;
}

function loadSaved<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

const MIN_W = 220;
const MIN_H = 120;

type ResizeDir = 'e' | 'w' | 's' | 'n' | 'se' | 'sw' | 'ne' | 'nw' | null;

export default function Window({
  title,
  icon,
  children,
  onClose,
  onMinimize,
  isMinimized,
  defaultPosition = { x: 100, y: 80 },
  defaultSize = { width: 500, height: 400 },
  zIndex,
  onFocus,
}: WindowProps) {
  const [pos, setPos] = useState(() => loadSaved(`win-pos-${title}`, defaultPosition));
  const [size, setSize] = useState(() => loadSaved(`win-size-${title}`, defaultSize));
  const [isMaximized, setIsMaximized] = useState(false);

  const dragging = useRef(false);
  const resizing = useRef<ResizeDir>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });

  // Global mouse move / up
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 200));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 60));
        setPos({ x: newX, y: newY });
        try { localStorage.setItem(`win-pos-${title}`, JSON.stringify({ x: newX, y: newY })); } catch {}
      }
      if (resizing.current) {
        const dir = resizing.current;
        const { mx, my, x, y, w, h } = resizeStart.current;
        const dx = e.clientX - mx;
        const dy = e.clientY - my;
        let newX = x, newY = y, newW = w, newH = h;
        if (dir.includes('e')) newW = Math.max(MIN_W, w + dx);
        if (dir.includes('s')) newH = Math.max(MIN_H, h + dy);
        if (dir.includes('w')) { newW = Math.max(MIN_W, w - dx); newX = x + w - newW; }
        if (dir.includes('n')) { newH = Math.max(MIN_H, h - dy); newY = y + h - newH; }
        setSize({ width: newW, height: newH });
        setPos({ x: newX, y: newY });
        try {
          localStorage.setItem(`win-size-${title}`, JSON.stringify({ width: newW, height: newH }));
          localStorage.setItem(`win-pos-${title}`, JSON.stringify({ x: newX, y: newY }));
        } catch {}
      }
    };
    const onUp = () => { dragging.current = false; resizing.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // Touch drag
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const t = e.touches[0];
      const newX = Math.max(0, Math.min(t.clientX - dragOffset.current.x, window.innerWidth - 200));
      const newY = Math.max(0, Math.min(t.clientY - dragOffset.current.y, window.innerHeight - 60));
      setPos({ x: newX, y: newY });
      try { localStorage.setItem(`win-pos-${title}`, JSON.stringify({ x: newX, y: newY })); } catch {}
    };
    const onTouchEnd = () => { dragging.current = false; };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('touchend', onTouchEnd); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const startDrag = (e: React.MouseEvent) => {
    if (isMaximized) return;
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  const startTouchDrag = (e: React.TouchEvent) => {
    if (isMaximized) return;
    const t = e.touches[0];
    dragging.current = true;
    dragOffset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
  };

  const startResize = (dir: ResizeDir) => (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    resizing.current = dir;
    resizeStart.current = { mx: e.clientX, my: e.clientY, x: pos.x, y: pos.y, w: size.width, h: size.height };
  };

  if (isMinimized) return null;

  const winStyle: React.CSSProperties = isMaximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 40px)', zIndex }
    : { left: pos.x, top: pos.y, width: size.width, height: size.height, zIndex };

  const edge = 5; // resize handle thickness px

  return (
    <div className="xp-window" style={winStyle} onMouseDown={onFocus}>
      {/* Resize handles */}
      {!isMaximized && (<>
        {/* Edges */}
        <div onMouseDown={startResize('n')}  style={{ position:'absolute', top:0,    left:edge,  right:edge,  height:edge, cursor:'n-resize',  zIndex:1 }} />
        <div onMouseDown={startResize('s')}  style={{ position:'absolute', bottom:0, left:edge,  right:edge,  height:edge, cursor:'s-resize',  zIndex:1 }} />
        <div onMouseDown={startResize('w')}  style={{ position:'absolute', top:edge, left:0,     bottom:edge, width:edge,  cursor:'w-resize',  zIndex:1 }} />
        <div onMouseDown={startResize('e')}  style={{ position:'absolute', top:edge, right:0,    bottom:edge, width:edge,  cursor:'e-resize',  zIndex:1 }} />
        {/* Corners */}
        <div onMouseDown={startResize('nw')} style={{ position:'absolute', top:0,    left:0,  width:edge, height:edge, cursor:'nw-resize', zIndex:2 }} />
        <div onMouseDown={startResize('ne')} style={{ position:'absolute', top:0,    right:0, width:edge, height:edge, cursor:'ne-resize', zIndex:2 }} />
        <div onMouseDown={startResize('sw')} style={{ position:'absolute', bottom:0, left:0,  width:edge, height:edge, cursor:'sw-resize', zIndex:2 }} />
        <div onMouseDown={startResize('se')} style={{ position:'absolute', bottom:0, right:0, width:edge+4, height:edge+4, cursor:'se-resize', zIndex:2 }} />
      </>)}

      <div className="xp-titlebar" onMouseDown={startDrag} onTouchStart={startTouchDrag}>
        <span className="xp-title-icon">{icon}</span>
        <span className="xp-title-text">{title}</span>
        <div className="xp-controls">
          <button className="xp-btn xp-min" onClick={(e) => { e.stopPropagation(); sounds.minimize(); onMinimize(); }} title="Minimize">_</button>
          <button className="xp-btn xp-max" onClick={(e) => { e.stopPropagation(); setIsMaximized((m) => !m); }} title="Maximize">□</button>
          <button className="xp-btn xp-close" onClick={(e) => { e.stopPropagation(); sounds.close(); onClose(); }} title="Close">✕</button>
        </div>
      </div>
      <div className="xp-body">{children}</div>

      {/* Visible SE resize grip */}
      {!isMaximized && (
        <div
          onMouseDown={startResize('se')}
          style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 14, height: 14, cursor: 'se-resize', zIndex: 3,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
            pointerEvents: 'all',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0.35 }}>
            <line x1="3" y1="10" x2="10" y2="3" stroke="#336" strokeWidth="1.5"/>
            <line x1="6" y1="10" x2="10" y2="6" stroke="#336" strokeWidth="1.5"/>
            <line x1="9" y1="10" x2="10" y2="9" stroke="#336" strokeWidth="1.5"/>
          </svg>
        </div>
      )}
    </div>
  );
}
