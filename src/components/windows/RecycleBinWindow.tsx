'use client';

import { useState } from 'react';

const FAKE_FILES = [
  { name: 'node_modules', size: '731 MB', deleted: '4/20/2026', type: '📁' },
  { name: 'TODO_actually_do_these.txt', size: '14 KB', deleted: '3/01/2026', type: '📄' },
  { name: 'spaghetti_code.js', size: '88 KB', deleted: '2/14/2026', type: '📜' },
  { name: 'imposter_syndrome.exe', size: '0 KB', deleted: '1/10/2026', type: '⚙️' },
  { name: 'my_stack_overflow_dignity.txt', size: '2 KB', deleted: '11/22/2025', type: '📄' },
  { name: 'git_commit_-m_fix.patch', size: '3 KB', deleted: '10/31/2025', type: '🔧' },
  { name: 'sleep_schedule.exe', size: '0 KB', deleted: '9/01/2025', type: '⚙️' },
  { name: 'README (unread).md', size: '1 KB', deleted: '8/15/2025', type: '📋' },
];

export default function RecycleBinWindow() {
  const [selected, setSelected] = useState<string | null>(null);
  const [emptied, setEmptied] = useState(false);
  const [files, setFiles] = useState(FAKE_FILES);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const handleEmpty = () => {
    if (confirmEmpty) {
      setFiles([]);
      setEmptied(true);
      setConfirmEmpty(false);
      setSelected(null);
    } else {
      setConfirmEmpty(true);
      setTimeout(() => setConfirmEmpty(false), 4000);
    }
  };

  const handleRestore = () => {
    if (selected) {
      setFiles((prev) => prev.filter((f) => f.name !== selected));
      setSelected(null);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
        background: 'linear-gradient(180deg, #f4f6fb 0%, #e8ecf6 100%)',
        borderBottom: '1px solid rgba(100,140,220,0.3)',
        flexShrink: 0,
      }}>
        <button
          className="xp-push-btn"
          onClick={handleRestore}
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.5, cursor: selected ? 'pointer' : 'default' }}
        >
          ♻️ Restore
        </button>
        <button
          className="xp-push-btn"
          onClick={handleEmpty}
          disabled={files.length === 0}
          style={{
            opacity: files.length === 0 ? 0.5 : 1,
            cursor: files.length === 0 ? 'default' : 'pointer',
            background: confirmEmpty
              ? 'linear-gradient(180deg, #ffcccc 0%, #ff8080 48%, #e04040 52%, #ffaaaa 100%)'
              : undefined,
            color: confirmEmpty ? '#600' : undefined,
          }}
        >
          {confirmEmpty ? '⚠️ Are you sure?' : '🗑️ Empty Recycle Bin'}
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: '#668', fontStyle: 'italic' }}>
          {files.length} item{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* File list */}
      <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        {emptied || files.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 12, color: '#778',
          }}>
            <div style={{ fontSize: 64 }}>🗑️</div>
            <div style={{ fontSize: 13, fontWeight: 'bold' }}>Recycle Bin is empty</div>
            <div style={{ fontSize: 10, textAlign: 'center', color: '#99a', maxWidth: 240 }}>
              Nothing to see here... yet. Keep browsing.
            </div>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr 80px 100px',
              padding: '4px 10px',
              background: '#e8ecf6',
              borderBottom: '1px solid rgba(100,140,220,0.3)',
              fontSize: 10, fontWeight: 'bold', color: '#334',
            }}>
              <div />
              <div>Name</div>
              <div>Size</div>
              <div>Date Deleted</div>
            </div>

            {files.map((f) => (
              <div
                key={f.name}
                onClick={() => setSelected(f.name === selected ? null : f.name)}
                onDoubleClick={() => {}}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr 80px 100px',
                  padding: '5px 10px',
                  alignItems: 'center',
                  cursor: 'default',
                  background: f.name === selected
                    ? 'rgba(60,120,220,0.25)'
                    : 'transparent',
                  borderBottom: '1px solid rgba(180,200,240,0.3)',
                  fontSize: 11, color: '#001060',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (f.name !== selected) e.currentTarget.style.background = 'rgba(100,160,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (f.name !== selected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ fontSize: 18 }}>{f.type}</div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                  {f.name}
                </div>
                <div style={{ color: '#556', fontSize: 10 }}>{f.size}</div>
                <div style={{ color: '#556', fontSize: 10 }}>{f.deleted}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '4px 10px',
        background: 'linear-gradient(180deg, #e8ecf6 0%, #dde4f4 100%)',
        borderTop: '1px solid rgba(100,140,220,0.3)',
        fontSize: 10, color: '#556',
        flexShrink: 0,
      }}>
        {selected
          ? `"${selected}" selected — right-click to restore or delete permanently`
          : `Recycle Bin · ${files.length} item${files.length !== 1 ? 's' : ''}`}
      </div>
    </div>
  );
}
