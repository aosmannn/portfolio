'use client';

import { useEffect, useState } from 'react';
import Window from './Window';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import CalendarWidget from './CalendarWidget';
import MusicPlayer from './MusicPlayer';
import BlogWidget from './BlogWidget';
import WeatherWidget from './WeatherWidget';
import ToastManager from './ToastManager';
import ContextMenu from './ContextMenu';
import Screensaver from './Screensaver';
import Clippy from './Clippy';
import BSOD from './BSOD';
import KonamiCode from './KonamiCode';
import SearchOverlay from './SearchOverlay';
import StickyNotesManager from './StickyNotesManager';
import AboutWindow from './windows/AboutWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import ContactWindow from './windows/ContactWindow';
import ResumeWindow from './windows/ResumeWindow';
import BlogWindow from './windows/BlogWindow';
import RecycleBinWindow from './windows/RecycleBinWindow';
import PlaylistHistory from './windows/PlaylistHistory';
import TaskManager from './windows/TaskManager';
import SnippingTool from './windows/SnippingTool';
import SkillsWindow from './windows/SkillsWindow';
import CmdWindow from './windows/CmdWindow';
import GitHubWindow from './windows/GitHubWindow';
import FakeError from './FakeError';
import BootScreen from './BootScreen';
import { sounds } from '@/lib/sounds';
import { triggerClippyMessage, setVirusCallback } from './Clippy';
import { showToast } from '@/lib/toast';

type WinId = 'about' | 'projects' | 'contact' | 'resume' | 'music' | 'blog' | 'bin' | 'history' | 'tasks' | 'snip' | 'skills' | 'cmd' | 'github';

interface WinState { open: boolean; minimized: boolean; }

const WIN_CONFIG: Record<WinId, { title: string; icon: string; defaultPosition: { x: number; y: number }; defaultSize: { width: number; height: number } }> = {
  about:   { title: 'About Me',         icon: '👤', defaultPosition: { x: 80,  y: 60  }, defaultSize: { width: 580, height: 420 } },
  projects:{ title: 'Projects',         icon: '📁', defaultPosition: { x: 150, y: 80  }, defaultSize: { width: 720, height: 520 } },
  contact: { title: 'Contact',          icon: '✉️', defaultPosition: { x: 240, y: 100 }, defaultSize: { width: 480, height: 380 } },
  resume:  { title: 'Resume',           icon: '📄', defaultPosition: { x: 180, y: 70  }, defaultSize: { width: 600, height: 460 } },
  music:   { title: 'Music Player',     icon: '🎵', defaultPosition: { x: 20,  y: 60  }, defaultSize: { width: 300, height: 360 } },
  blog:    { title: 'My Blog',          icon: '📝', defaultPosition: { x: 300, y: 90  }, defaultSize: { width: 580, height: 420 } },
  bin:     { title: 'Recycle Bin',      icon: '🗑️', defaultPosition: { x: 200, y: 120 }, defaultSize: { width: 520, height: 360 } },
  history: { title: 'Playlist History', icon: '🎶', defaultPosition: { x: 340, y: 80  }, defaultSize: { width: 420, height: 380 } },
  tasks:   { title: 'Task Manager',     icon: '⚙️', defaultPosition: { x: 160, y: 60  }, defaultSize: { width: 580, height: 420 } },
  snip:    { title: 'Snipping Tool',    icon: '✂️', defaultPosition: { x: 200, y: 140 }, defaultSize: { width: 360, height: 260 } },
  skills:  { title: 'Skills & XP',     icon: '🏆', defaultPosition: { x: 200, y: 80  }, defaultSize: { width: 500, height: 420 } },
  cmd:     { title: 'Command Prompt',  icon: '🖥️', defaultPosition: { x: 220, y: 100 }, defaultSize: { width: 520, height: 360 } },
  github:  { title: 'GitHub Activity', icon: '🐙', defaultPosition: { x: 180, y: 80  }, defaultSize: { width: 520, height: 400 } },
};

const DESKTOP_ICONS: { id: WinId; label: string; emoji: string; x: number; y: number }[] = [
  { id: 'about',    label: 'About Me',    emoji: '👤', x: 10,  y: 20  },
  { id: 'projects', label: 'Projects',    emoji: '📁', x: 100, y: 20  },
  { id: 'resume',   label: 'Resume',      emoji: '📄', x: 10,  y: 110 },
  { id: 'contact',  label: 'Contact',     emoji: '✉️', x: 100, y: 110 },
  { id: 'blog',     label: 'Blog',        emoji: '📝', x: 10,  y: 200 },
  { id: 'bin',      label: 'Recycle Bin', emoji: '🗑️', x: 100, y: 200 },
  { id: 'tasks',    label: 'Task Mgr',    emoji: '⚙️', x: 10,  y: 290 },
  { id: 'skills',   label: 'Skills',      emoji: '🏆', x: 100, y: 380 },
  { id: 'cmd',      label: 'cmd.exe',     emoji: '🖥️', x: 100, y: 470 },
  { id: 'github',   label: 'GitHub',      emoji: '🐙', x: 100, y: 560 },
];

interface CtxMenu { x: number; y: number; }

export default function Desktop() {
  const [musicPos] = useState(() => ({
    x: typeof window !== 'undefined' ? Math.max(0, window.innerWidth - 320) : 1100,
    y: 20,
  }));

  const [wins, setWins] = useState<Record<WinId, WinState>>(() => {
    const init: Record<string, WinState> = {};
    for (const id of Object.keys(WIN_CONFIG)) init[id] = { open: false, minimized: false };
    init['music'] = { open: false, minimized: false };
    return init as Record<WinId, WinState>;
  });

  const [zStack, setZStack] = useState<WinId[]>([]);
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null);
  const [booted, setBooted] = useState(true);
  const [showBSOD, setShowBSOD] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [addNoteSignal, setAddNoteSignal] = useState(0);
  const [virusShake, setVirusShake] = useState(false);
  const [redFlicker, setRedFlicker] = useState(false);
  const [virusErrors, setVirusErrors] = useState(0);
  const [bsodCode, setBsodCode] = useState('RECRUITER_NOT_HIRING_FAST_ENOUGH');

  const openWindow = (id: WinId) => {
    sounds.open();
    setWins(prev => ({ ...prev, [id]: { open: true, minimized: false } }));
    setZStack(prev => [...prev.filter(z => z !== id), id]);
  };

  const closeWindow = (id: WinId) => {
    setWins(prev => ({ ...prev, [id]: { open: false, minimized: false } }));
    setZStack(prev => prev.filter(z => z !== id));
  };

  const minimizeWindow = (id: WinId) => {
    setWins(prev => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
  };

  const focusWindow = (id: WinId) => {
    setZStack(prev => [...prev.filter(z => z !== id), id]);
  };

  const toggleWindow = (id: WinId) => {
    const w = wins[id];
    if (!w.open) { openWindow(id); }
    else if (w.minimized) { sounds.open(); setWins(prev => ({ ...prev, [id]: { open: true, minimized: false } })); focusWindow(id); }
    else { minimizeWindow(id); sounds.minimize(); }
  };

  const getZIndex = (id: WinId) => {
    const idx = zStack.indexOf(id);
    return idx === -1 ? 100 : 100 + idx;
  };

  useEffect(() => {
    if (!localStorage.getItem('booted')) {
      setBooted(false);
    }
  }, []);

  // BSOD keyboard trigger: type "bsod"
  useEffect(() => {
    let buf = '';
    const handler = (e: KeyboardEvent) => {
      if (showSearch) return;
      buf = (buf + e.key).slice(-4);
      if (buf === 'bsod') setShowBSOD(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch]);

  // Win key (Meta) or Ctrl+F → search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Clippy virus easter egg
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('clippy-virus-done')) return;

    const runVirusSequence = () => {
      sessionStorage.setItem('clippy-virus-done', '1');
      const ts: ReturnType<typeof setTimeout>[] = [];
      const at = (ms: number, fn: () => void) => ts.push(setTimeout(fn, ms));
      at(0,     () => showToast({ title: '🛡️ antivirus.exe', body: 'Installing... ██████████ 100%' }));
      at(2500,  () => showToast({ title: '✅ antivirus.exe', body: 'Protection enabled! Your PC is safe.' }));
      at(5500,  () => triggerClippyMessage('⚠️ Scan complete. 1,337 threats found. Removing now...', true));
      at(8500,  () => setVirusShake(true));
      at(9500,  () => setVirusErrors(5));
      at(11500, () => { setRedFlicker(true); setTimeout(() => setRedFlicker(false), 1500); });
      at(13500, () => triggerClippyMessage('Oops.', true));
      at(15500, () => { setVirusShake(false); setVirusErrors(0); setBsodCode('CLIPPY_BETRAYAL_EXCEPTION'); setShowBSOD(true); });
    };

    setVirusCallback(runVirusSequence);

    // Show antivirus prompt after 20s
    const t = setTimeout(() => {
      if (!sessionStorage.getItem('clippy-virus-done')) {
        triggerClippyMessage("It looks like you're browsing without antivirus. Should I install one?", true);
      }
    }, 20000);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  };

  const taskbarWindows = (Object.keys(WIN_CONFIG) as WinId[]).map(id => ({
    id, title: WIN_CONFIG[id].title, icon: WIN_CONFIG[id].icon,
    open: wins[id].open, minimized: wins[id].minimized,
  }));

  return (
    <>
    {!booted && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 99998 }}>
        <BootScreen onComplete={() => { localStorage.setItem('booted', '1'); setBooted(true); }} />
      </div>
    )}
    {showBSOD && <BSOD onDismiss={() => { setShowBSOD(false); setBsodCode('RECRUITER_NOT_HIRING_FAST_ENOUGH'); }} stopCode={bsodCode} />}
    <div className="desktop" onContextMenu={handleContextMenu} onClick={() => setCtxMenu(null)}>

      {/* Desktop Icons */}
      <div className={virusShake ? 'virus-shake' : ''}>
      {DESKTOP_ICONS.map(icon => (
        <DesktopIcon key={icon.id} label={icon.label} emoji={icon.emoji}
          defaultX={icon.x} defaultY={icon.y}
          onDoubleClick={() => openWindow(icon.id)}
        />
      ))}

      {/* Snipping Tool icon on desktop */}
      <DesktopIcon label="Snipping Tool" emoji="✂️"
        defaultX={100} defaultY={290}
        onDoubleClick={() => openWindow('snip')}
      />

      {/* Sticky Note icon on desktop */}
      <DesktopIcon label="Sticky Note" emoji="📌"
        defaultX={10} defaultY={380}
        onDoubleClick={() => setAddNoteSignal(s => s + 1)}
      />
      </div>

      {/* Calendar */}
      <CalendarWidget />

      {/* Weather */}
      <WeatherWidget />

      {/* Sticky Notes */}
      <StickyNotesManager addNoteSignal={addNoteSignal} />

      {/* Windows */}
      {(Object.keys(WIN_CONFIG) as WinId[]).map(id => {
        if (!wins[id].open) return null;
        const cfg = WIN_CONFIG[id];
        return (
          <Window key={id} title={cfg.title} icon={cfg.icon}
            defaultPosition={id === 'music' ? musicPos : cfg.defaultPosition}
            defaultSize={cfg.defaultSize}
            isMinimized={wins[id].minimized}
            zIndex={getZIndex(id)}
            onClose={() => closeWindow(id)}
            onMinimize={() => { sounds.minimize(); minimizeWindow(id); }}
            onFocus={() => focusWindow(id)}
          >
            {id === 'about'    && <AboutWindow />}
            {id === 'projects' && <ProjectsWindow onOpenProject={href => window.open(href, '_blank')} />}
            {id === 'contact'  && <ContactWindow />}
            {id === 'resume'   && <ResumeWindow />}
            {id === 'music'    && <MusicPlayer />}
            {id === 'blog'     && <BlogWindow />}
            {id === 'bin'      && <RecycleBinWindow />}
            {id === 'history'  && <PlaylistHistory />}
            {id === 'tasks'    && <TaskManager />}
            {id === 'snip'     && <SnippingTool onClose={() => closeWindow('snip')} />}
            {id === 'skills'   && <SkillsWindow />}
            {id === 'cmd'      && <CmdWindow />}
            {id === 'github'   && <GitHubWindow />}
          </Window>
        );
      })}

      {/* Blog Widget */}
      <BlogWidget onOpen={() => openWindow('blog')} />

      {/* Context Menu */}
      {ctxMenu && (
        <ContextMenu x={ctxMenu.x} y={ctxMenu.y}
          onClose={() => setCtxMenu(null)}
          onOpenAbout={() => openWindow('about')}
          onBSOD={() => { setCtxMenu(null); setShowBSOD(true); }}
          onStickyNote={() => { setCtxMenu(null); setAddNoteSignal(s => s + 1); }}
        />
      )}

      {/* Search overlay */}
      {showSearch && (
        <SearchOverlay
          onOpen={id => openWindow(id as WinId)}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Easter eggs */}
      <KonamiCode />
      <Clippy />
      <FakeError />
      {Array.from({ length: virusErrors }).map((_, i) => (
        <FakeError key={`virus-err-${i}`} forceShow />
      ))}

      {/* Screensaver + Toast */}
      <Screensaver />
      <ToastManager />

      {/* Taskbar */}
      <Taskbar
        windows={taskbarWindows}
        onWindowClick={id => toggleWindow(id as WinId)}
        onMusicClick={() => openWindow('music')}
        onSearchClick={() => setShowSearch(true)}
      />
      {redFlicker && <div style={{ position:'fixed', inset:0, zIndex:99990, pointerEvents:'none', background:'rgba(255,0,0,0.4)', animation:'redFlicker 1.5s ease-in-out' }} />}
    </div>
    </>
  );
}
