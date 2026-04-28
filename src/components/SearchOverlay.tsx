'use client';

import { useEffect, useRef, useState } from 'react';

interface SearchResult { id: string; label: string; icon: string; type: string; }

interface SearchOverlayProps {
  onOpen: (id: string) => void;
  onClose: () => void;
}

const ALL_RESULTS: SearchResult[] = [
  { id: 'about',    label: 'About Me',      icon: '👤', type: 'Window'   },
  { id: 'projects', label: 'Projects',      icon: '📁', type: 'Window'   },
  { id: 'resume',   label: 'Resume',        icon: '📄', type: 'Window'   },
  { id: 'contact',  label: 'Contact',       icon: '✉️', type: 'Window'   },
  { id: 'blog',     label: 'Blog',          icon: '📝', type: 'Window'   },
  { id: 'music',    label: 'Music Player',  icon: '🎵', type: 'Window'   },
  { id: 'history',  label: 'Playlist History', icon: '🎶', type: 'Window'},
  { id: 'tasks',    label: 'Task Manager',  icon: '⚙️', type: 'Window'   },
  { id: 'bin',      label: 'Recycle Bin',   icon: '🗑️', type: 'Window'   },
  { id: 'snip',     label: 'Snipping Tool', icon: '✂️', type: 'Window'   },
  { id: 'github',   label: 'GitHub Profile', icon: '🐙', type: 'Link'    },
  { id: 'admin',    label: 'Blog Admin',    icon: '🔧', type: 'Link'     },
];

export default function SearchOverlay({ onOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.trim()
    ? ALL_RESULTS.filter(r => r.label.toLowerCase().includes(query.toLowerCase()))
    : ALL_RESULTS;

  useEffect(() => { setSelected(0); }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && results[selected]) activate(results[selected]);
  };

  const activate = (r: SearchResult) => {
    if (r.id === 'github') { window.open('https://github.com/aosmannn', '_blank'); onClose(); return; }
    if (r.id === 'admin')  { window.open('/admin', '_blank'); onClose(); return; }
    onOpen(r.id);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9900,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '15vh',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 480,
          background: 'rgba(10,20,50,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(100,150,255,0.3)',
          borderRadius: 8,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          fontFamily: 'Tahoma, sans-serif',
        }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(100,150,255,0.15)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(100,150,255,0.7)">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="rgba(100,150,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search programs and files..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'white', fontSize: 14, fontFamily: 'Tahoma, sans-serif',
            }}
          />
          <span style={{ fontSize: 10, color: 'rgba(100,150,255,0.5)', flexShrink: 0 }}>ESC to close</span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {results.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(150,180,255,0.5)', fontSize: 12 }}>
              No results for &quot;{query}&quot;
            </div>
          ) : results.map((r, i) => (
            <div
              key={r.id}
              onClick={() => activate(r)}
              onMouseEnter={() => setSelected(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 16px', cursor: 'pointer',
                background: i === selected ? 'rgba(60,120,255,0.25)' : 'transparent',
                borderLeft: i === selected ? '2px solid #4080ff' : '2px solid transparent',
                transition: 'background 0.1s',
              }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: 13, color: 'white' }}>{r.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(150,180,255,0.5)' }}>{r.type}</div>
              </div>
              {i === selected && (
                <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(150,180,255,0.5)' }}>↵ Enter</div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(100,150,255,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 88 88" fill="none">
            <path d="M0 12.4L36 7.2V42H0V12.4Z" fill="#F25022"/>
            <path d="M40 6.6L88 0V42H40V6.6Z" fill="#7FBA00"/>
            <path d="M0 46H36V81L0 75.6V46Z" fill="#00A4EF"/>
            <path d="M40 46H88V88L40 81.4V46Z" fill="#FFB900"/>
          </svg>
          <span style={{ fontSize: 10, color: 'rgba(150,180,255,0.5)' }}>Windows Search · adamosman.dev</span>
        </div>
      </div>
    </div>
  );
}
