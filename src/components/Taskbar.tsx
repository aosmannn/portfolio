'use client';

import { useEffect, useState } from 'react';
import NowPlaying from '@/components/NowPlaying';
import SystemTray from '@/components/SystemTray';

interface TaskbarWindow {
  id: string;
  title: string;
  icon: string;
  open: boolean;
  minimized: boolean;
}

interface TaskbarProps {
  windows: TaskbarWindow[];
  onWindowClick: (id: string) => void;
  onMusicClick: () => void;
  onSearchClick?: () => void;
}

export default function Taskbar({ windows, onWindowClick, onMusicClick, onSearchClick }: TaskbarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTime(`${h}:${m} ${ampm}`);
      setDate(`${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="xp-taskbar">
      {/* Start button */}
      <button className="xp-start-btn" onClick={onMusicClick} title="Start">
        <svg width="20" height="20" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top-left: red */}
          <path d="M0 12.4L36 7.2V42H0V12.4Z" fill="#F25022"/>
          {/* Top-right: green */}
          <path d="M40 6.6L88 0V42H40V6.6Z" fill="#7FBA00"/>
          {/* Bottom-left: blue */}
          <path d="M0 46H36V81L0 75.6V46Z" fill="#00A4EF"/>
          {/* Bottom-right: yellow */}
          <path d="M40 46H88V88L40 81.4V46Z" fill="#FFB900"/>
        </svg>
      </button>

      {/* Search button */}
      {onSearchClick && (
        <button
          onClick={onSearchClick}
          title="Search (Ctrl+F)"
          style={{
            height: 28, padding: '0 10px', background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3,
            color: 'rgba(255,255,255,0.7)', fontFamily: 'Tahoma, sans-serif',
            fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 5, flexShrink: 0, transition: 'background 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
        >
          🔍 <span>Search</span>
        </button>
      )}

      {/* Separator */}
      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)', margin: '0 2px', flexShrink: 0 }} />

      {/* Window buttons */}
      {windows.filter((w) => w.open).map((w) => (
        <button
          key={w.id}
          className={`taskbar-window-btn${!w.minimized ? ' active' : ''}`}
          onClick={() => onWindowClick(w.id)}
          title={w.title}
        >
          <span>{w.icon}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.title}</span>
        </button>
      ))}

      {/* Now Playing - Spotify */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <NowPlaying />
        <SystemTray />
        {/* Clock */}
        <div className="taskbar-clock" style={{ marginLeft: 0 }}>
          <div>{time}</div>
          <div>{date}</div>
        </div>
      </div>
    </div>
  );
}
