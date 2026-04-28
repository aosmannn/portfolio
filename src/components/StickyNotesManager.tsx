'use client';

import { useEffect, useRef, useState } from 'react';

interface StickyNote { id: string; x: number; y: number; text: string; color: string; }

const COLORS = ['#fff59d','#f8bbd0','#b3e5fc','#c8e6c9','#ffe0b2','#e1bee7'];
const KEY = 'sticky-notes-v1';

function load(): StickyNote[] {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function save(notes: StickyNote[]) {
  try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch {}
}

interface Props { addNoteSignal: number; }

export default function StickyNotesManager({ addNoteSignal }: Props) {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const dragging = useRef<{ id: string; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const existing = load();
    setNotes(existing);
    if (!localStorage.getItem('sticky-welcomed')) {
      const welcome: StickyNote = {
        id: 'welcome',
        x: 120,
        y: 80,
        text: '👋 Welcome!\n\nDouble-click any icon to open it.\n\nRight-click the desktop for more options.\n\nTry the Search bar too!',
        color: '#fff59d',
      };
      const next = [...existing, welcome];
      save(next);
      setNotes(next);
      localStorage.setItem('sticky-welcomed', '1');
    }
  }, []);

  // Add new note when signal fires
  useEffect(() => {
    if (addNoteSignal === 0) return;
    const note: StickyNote = {
      id: Date.now().toString(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      text: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setNotes(prev => { const next = [...prev, note]; save(next); return next; });
  }, [addNoteSignal]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const { id, ox, oy } = dragging.current;
      setNotes(prev => {
        const next = prev.map(n => n.id === id ? { ...n, x: e.clientX - ox, y: e.clientY - oy } : n);
        save(next);
        return next;
      });
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const updateText = (id: string, text: string) => {
    setNotes(prev => { const next = prev.map(n => n.id === id ? { ...n, text } : n); save(next); return next; });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => { const next = prev.filter(n => n.id !== id); save(next); return next; });
  };

  return (
    <>
      {notes.map(note => (
        <div
          key={note.id}
          style={{
            position: 'fixed', left: note.x, top: note.y,
            width: 180, minHeight: 140,
            background: note.color,
            boxShadow: '2px 4px 12px rgba(0,0,0,0.25)',
            zIndex: 400,
            display: 'flex', flexDirection: 'column',
            fontFamily: 'Tahoma, sans-serif',
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <div
            onMouseDown={e => {
              dragging.current = { id: note.id, ox: e.clientX - note.x, oy: e.clientY - note.y };
              e.preventDefault();
            }}
            style={{
              padding: '4px 6px',
              background: 'rgba(0,0,0,0.12)',
              cursor: 'move',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              userSelect: 'none', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 'bold' }}>📝 Note</span>
            <button
              onClick={() => deleteNote(note.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(0,0,0,0.4)', padding: '0 2px', lineHeight: 1 }}
            >✕</button>
          </div>
          {/* Body */}
          <textarea
            value={note.text}
            onChange={e => updateText(note.id, e.target.value)}
            placeholder="Type your note..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '6px 8px', resize: 'none', fontSize: 12,
              fontFamily: 'Tahoma, sans-serif', color: '#333',
              minHeight: 100,
            }}
          />
        </div>
      ))}
    </>
  );
}
