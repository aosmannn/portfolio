'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Mode = 'idle' | 'selecting' | 'done';

interface Rect { x: number; y: number; w: number; h: number; }

interface Props { onClose: () => void; }

export default function SnippingTool({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('idle');
  const [rect, setRect] = useState<Rect | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const startSnip = () => {
    setMode('selecting');
    setRect(null);
    setCopied(false);
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'selecting') return;
    startRef.current = { x: e.clientX, y: e.clientY };
  }, [mode]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (mode !== 'selecting' || !startRef.current) return;
    const { x, y } = startRef.current;
    setRect({
      x: Math.min(x, e.clientX),
      y: Math.min(y, e.clientY),
      w: Math.abs(e.clientX - x),
      h: Math.abs(e.clientY - y),
    });
  }, [mode]);

  const onMouseUp = useCallback(() => {
    if (mode !== 'selecting') return;
    setMode('done');
    startRef.current = null;
  }, [mode]);

  const fakeCapture = () => {
    if (!rect) return;
    setCopied(true);
    // Show as if copied
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode === 'selecting' || mode === 'done') {
    return (
      <div
        ref={overlayRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          position: 'fixed', inset: 0, zIndex: 50000,
          cursor: mode === 'selecting' ? 'crosshair' : 'default',
          background: 'rgba(0,0,0,0.35)',
        }}
        onClick={mode === 'done' ? () => { setMode('idle'); } : undefined}
      >
        {/* Selection rect */}
        {rect && rect.w > 2 && rect.h > 2 && (
          <div style={{
            position: 'absolute',
            left: rect.x, top: rect.y, width: rect.w, height: rect.h,
            border: '2px solid #0078d7',
            background: 'rgba(0,120,215,0.1)',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
            pointerEvents: 'none',
          }}>
            {/* Dimension label */}
            <div style={{
              position: 'absolute', top: -22, left: 0,
              background: '#0078d7', color: 'white',
              fontSize: 11, padding: '2px 6px', borderRadius: 3,
              fontFamily: 'Tahoma, sans-serif', whiteSpace: 'nowrap',
            }}>
              {Math.round(rect.w)} × {Math.round(rect.h)} px
            </div>
          </div>
        )}

        {/* Done toolbar */}
        {mode === 'done' && rect && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: rect.x, top: rect.y + rect.h + 8,
              background: 'white',
              border: '1px solid rgba(100,140,220,0.4)',
              borderRadius: 4,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              padding: '6px 8px',
              display: 'flex', gap: 8, alignItems: 'center',
              fontFamily: 'Tahoma, sans-serif', fontSize: 11,
            }}
          >
            <span style={{ color: '#334' }}>
              Snipped: {Math.round(rect.w)} × {Math.round(rect.h)}
            </span>
            <button
              onClick={fakeCapture}
              className="xp-push-btn"
              style={{ fontSize: 11, padding: '2px 10px' }}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button onClick={() => { setMode('idle'); onClose(); }} className="xp-push-btn" style={{ fontSize: 11, padding: '2px 10px' }}>
              ✕ Close
            </button>
          </div>
        )}
      </div>
    );
  }

  // Idle state — shown inside the window
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Tahoma, sans-serif', padding: 24 }}>
      <div style={{ fontSize: 56 }}>✂️</div>
      <div style={{ fontSize: 14, fontWeight: 'bold', color: '#001060' }}>Snipping Tool</div>
      <div style={{ fontSize: 11, color: '#668', textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>
        Click New Snip to draw a selection on the screen. Drag to capture any area.
      </div>
      <button
        onClick={startSnip}
        className="aero-btn"
        style={{ padding: '8px 28px', fontSize: 13 }}
      >
        ✂️ New Snip
      </button>
      <div style={{ fontSize: 10, color: '#99a', textAlign: 'center' }}>
        Tip: Your selection dimensions will be shown in pixels
      </div>
    </div>
  );
}
