'use client';

import { useState } from 'react';

const INITIAL_TEXT = `README.txt - Adam Osman
========================

Hi, you opened Notepad.
Congrats. You're clearly very thorough.

About Me:
- CS Student @ Georgia State University
- Founder of CourseConnect AI
- Builder of things that probably shouldn't exist
  (like this Windows 7 portfolio)

Skills:
- React, Next.js, TypeScript (professional)
- Making Clippy say things (expert)
- Explaining to people why the desktop IS the portfolio (ongoing)

If you're a recruiter reading this:
  Please hire me. Clippy said so.

If you're a developer reading this:
  You know exactly why I built this.
  We're the same person.

Contact: adamosmn06@gmail.com
LinkedIn: linkedin.com/in/adamogsu

[EOF]
- This file last modified: never, it's a portfolio`;

const MENUS = ['File', 'Edit', 'Format', 'View', 'Help'];

export default function NotepadWindow() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, sans-serif' }}
      onClick={() => setOpenMenu(null)}
    >
      {/* Menu bar */}
      <div style={{
        background: '#f0f0f0', borderBottom: '1px solid #c0c0c0',
        padding: '2px 4px', display: 'flex', gap: 0,
        position: 'relative', zIndex: 10,
      }}>
        {MENUS.map(menu => (
          <div key={menu} style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === menu ? null : menu); }}
              style={{
                background: openMenu === menu ? '#0078d7' : 'transparent',
                color: openMenu === menu ? 'white' : '#000',
                border: 'none', padding: '2px 8px',
                fontSize: 12, cursor: 'default',
                borderRadius: 2,
              }}
              onMouseEnter={e => {
                if (openMenu) setOpenMenu(menu);
                if (openMenu !== menu) { e.currentTarget.style.background = '#e0e0e0'; }
              }}
              onMouseLeave={e => {
                if (openMenu !== menu) e.currentTarget.style.background = 'transparent';
              }}
            >
              {menu}
            </button>
            {openMenu === menu && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute', top: '100%', left: 0,
                  background: 'white', border: '1px solid #c0c0c0',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.2)',
                  minWidth: 160, zIndex: 100,
                  fontFamily: 'Tahoma, sans-serif', fontSize: 12,
                }}
              >
                {['New', 'Open...', 'Save', 'Save As...', '—', 'Print...', '—', 'Exit'].map((item, i) => (
                  item === '—'
                    ? <div key={i} style={{ height: 1, background: '#ddd', margin: '2px 4px' }} />
                    : <div
                        key={i}
                        style={{ padding: '4px 16px', cursor: 'default', color: '#888' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0078d7'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#888'; }}
                      >
                        {item}
                      </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          flex: 1,
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          lineHeight: 1.5,
          color: '#000',
          background: '#fff',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '4px 6px',
          whiteSpace: 'pre',
          overflowWrap: 'normal',
          overflow: 'auto',
        }}
        spellCheck={false}
      />

      {/* Status bar */}
      <div style={{
        background: '#f0f0f0', borderTop: '1px solid #c0c0c0',
        padding: '2px 8px', fontSize: 11, color: '#555',
        display: 'flex', gap: 16,
      }}>
        <span>Ln 1, Col 1</span>
        <span>100%</span>
        <span>Windows (CRLF)</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
