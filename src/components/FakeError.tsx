'use client';

import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  'recruiter.exe has stopped working',
  'coffee.exe ran out of memory',
  'imposter_syndrome.dll failed to load',
  'sleep.exe has not responded',
  'Error 404: Work-life balance not found',
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface FakeErrorProps {
  forceShow?: boolean;
}

export default function FakeError({ forceShow }: FakeErrorProps = {}) {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [pos, setPos] = useState({ x: 300, y: 200 });
  const dragging = useRef<{ ox: number; oy: number } | null>(null);
  const [dragPos, setDragPos] = useState({ x: 300, y: 200 });

  useEffect(() => {
    if (forceShow) {
      const x = randomBetween(100, Math.max(200, window.innerWidth - 380));
      const y = randomBetween(80, Math.max(150, window.innerHeight - 200));
      setMsg(MESSAGES[randomBetween(0, MESSAGES.length - 1)]);
      setPos({ x, y });
      setDragPos({ x, y });
      setVisible(true);
      return;
    }
    const schedule = () => {
      const delay = randomBetween(3 * 60 * 1000, 5 * 60 * 1000);
      return setTimeout(() => {
        const x = randomBetween(100, Math.max(200, window.innerWidth - 380));
        const y = randomBetween(80, Math.max(150, window.innerHeight - 200));
        setMsg(MESSAGES[randomBetween(0, MESSAGES.length - 1)]);
        setPos({ x, y });
        setDragPos({ x, y });
        setVisible(true);
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, [visible, forceShow]);

  useEffect(() => {
    if (!visible) return;
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setDragPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy });
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', left: dragPos.x, top: dragPos.y,
      width: 360, zIndex: 99990,
      fontFamily: 'Tahoma, sans-serif',
      boxShadow: '2px 4px 16px rgba(0,0,0,0.5)',
      borderRadius: 4, overflow: 'hidden',
      border: '1px solid #999',
    }}>
      {/* Title bar */}
      <div
        onMouseDown={e => {
          dragging.current = { ox: e.clientX - dragPos.x, oy: e.clientY - dragPos.y };
          e.preventDefault();
        }}
        style={{
          background: 'linear-gradient(180deg, #c0392b 0%, #922b21 100%)',
          color: '#fff', padding: '5px 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'move', userSelect: 'none', fontSize: 12, fontWeight: 'bold',
        }}
      >
        <span>⚠️ Windows Error</span>
        <button onClick={() => setVisible(false)} style={{
          background: 'linear-gradient(180deg,#e74c3c,#c0392b)', border: '1px solid #922b21',
          color: '#fff', width: 18, height: 18, cursor: 'pointer',
          fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 2, fontWeight: 'bold', padding: 0,
        }}>✕</button>
      </div>
      {/* Body */}
      <div style={{ background: '#fff', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <span style={{ fontSize: 36, flexShrink: 0 }}>🔴</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 6 }}>{msg}</div>
            <div style={{ fontSize: 11, color: '#555' }}>Windows can collect more information about this problem online.</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {['OK', "Don't Send"].map(label => (
            <button key={label} onClick={() => setVisible(false)} style={{
              padding: '4px 16px', fontSize: 12, fontFamily: 'Tahoma, sans-serif',
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)',
              border: '1px solid #999', borderRadius: 3, cursor: 'pointer',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
