'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ── SVG Icons ────────────────────────────────────────────────────────────────

function SpeakerHigh() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <path d="M1 5.5v5h3l4 3v-11l-4 3H1z"/>
      <path d="M11.5 8c0-1.5-.8-2.8-2-3.5v7c1.2-.7 2-2 2-3.5z" opacity="0.7"/>
      <path d="M13.5 8c0-2.5-1.4-4.7-3.5-5.8v1.2C11.6 4.3 12.5 6 12.5 8s-.9 3.7-2.5 4.6v1.2c2.1-1.1 3.5-3.3 3.5-5.8z" opacity="0.5"/>
    </svg>
  );
}

function SpeakerLow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <path d="M1 5.5v5h3l4 3v-11l-4 3H1z"/>
      <path d="M11.5 8c0-1.5-.8-2.8-2-3.5v7c1.2-.7 2-2 2-3.5z" opacity="0.7"/>
    </svg>
  );
}

function SpeakerMuted() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <path d="M1 5.5v5h3l4 3v-11l-4 3H1z"/>
      <line x1="10" y1="6" x2="14" y2="10" stroke="white" strokeWidth="1.5"/>
      <line x1="14" y1="6" x2="10" y2="10" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

function BatteryIcon({ level, charging }: { level: number; charging: boolean }) {
  const fillWidth = Math.round(level / 100 * 10);
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <rect x="1" y="4" width="12" height="8" rx="1" stroke="white" strokeWidth="1" fill="none"/>
      <rect x="13" y="6" width="2" height="4" rx="0.5" fill="white" opacity="0.7"/>
      <rect x="2" y="5" width={fillWidth} height="6" rx="0.5" fill={charging ? '#6cf' : level < 20 ? '#f66' : 'white'}/>
      {charging && (
        <path d="M6.5 5.5l-1.5 3h2.5l-1.5 3" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
      )}
    </svg>
  );
}

function WifiOn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
      <path d="M8 12l1.5-1.5A3 3 0 0 0 8 10a3 3 0 0 0-1.5.5L8 12z"/>
      <path d="M8 9.5c1.1 0 2.1.4 2.8 1.1l1.1-1.1A5 5 0 0 0 8 8a5 5 0 0 0-3.9 1.5l1.1 1.1A3.5 3.5 0 0 1 8 9.5z" opacity="0.7"/>
      <path d="M8 7c1.9 0 3.6.8 4.8 2l1.1-1.1A7.5 7.5 0 0 0 8 5.5a7.5 7.5 0 0 0-5.9 2.4l1.1 1.1A5.5 5.5 0 0 1 8 7z" opacity="0.5"/>
      <path d="M8 4.5c2.6 0 5 1.1 6.7 2.8l1.1-1.1A9.5 9.5 0 0 0 8 3a9.5 9.5 0 0 0-7.8 3.9" opacity="0.3"/>
    </svg>
  );
}

function WifiOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="white" opacity="0.5">
      <path d="M8 12l1.5-1.5A3 3 0 0 0 8 10a3 3 0 0 0-1.5.5L8 12z"/>
      <path d="M8 9.5c1.1 0 2.1.4 2.8 1.1l1.1-1.1A5 5 0 0 0 8 8a5 5 0 0 0-3.9 1.5l1.1 1.1A3.5 3.5 0 0 1 8 9.5z"/>
      <line x1="4" y1="4" x2="12" y2="12" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

// ── Aero popup wrapper ────────────────────────────────────────────────────────

const POPUP_STYLE: React.CSSProperties = {
  position: 'absolute',
  bottom: 40,
  right: 0,
  background: 'rgba(235,240,255,0.97)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(100,140,220,0.4)',
  borderRadius: 4,
  boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
  zIndex: 9999,
  color: '#222',
  fontFamily: 'Tahoma, "Segoe UI", sans-serif',
  fontSize: 11,
  userSelect: 'none',
};

// ── Volume ────────────────────────────────────────────────────────────────────

const STORAGE_KEY_VOL = 'win7-tray-volume';
const STORAGE_KEY_MUTE = 'win7-tray-muted';

function VolumePopup({ volume, muted, onChange, onToggleMute }: {
  volume: number;
  muted: boolean;
  onChange: (v: number) => void;
  onToggleMute: () => void;
}) {
  return (
    <div style={{ ...POPUP_STYLE, width: 36, padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: 10, color: '#444' }}>{muted ? 'Muted' : `${volume}%`}</div>
      {/* Vertical slider */}
      <div style={{ position: 'relative', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={e => { onChange(Number(e.target.value)); }}
          style={{
            writingMode: 'vertical-lr',
            direction: 'rtl',
            appearance: 'slider-vertical',
            WebkitAppearance: 'slider-vertical',
            width: 8,
            height: 80,
            cursor: 'pointer',
            accentColor: '#3a6fd8',
          } as React.CSSProperties}
        />
      </div>
      {/* Mute button */}
      <div
        onClick={onToggleMute}
        title={muted ? 'Unmute' : 'Mute'}
        style={{ cursor: 'pointer', opacity: muted ? 0.5 : 1, lineHeight: 1 }}
      >
        {muted
          ? <SpeakerMuted />
          : volume === 0 ? <SpeakerMuted />
          : volume < 50 ? <SpeakerLow />
          : <SpeakerHigh />}
      </div>
    </div>
  );
}

// ── Battery ───────────────────────────────────────────────────────────────────

interface BatteryState {
  level: number;      // 0-100
  charging: boolean;
  supported: boolean;
}

function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({ level: 100, charging: true, supported: false });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) return;

    let battery: BatteryManager;

    const update = () => {
      setState({
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        supported: true,
      });
    };

    nav.getBattery().then(b => {
      battery = b;
      update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
    });

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', update);
        battery.removeEventListener('chargingchange', update);
      }
    };
  }, []);

  return state;
}

// BatteryManager type declaration (not in default TS lib)
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

function BatteryPopup({ level, charging, supported }: BatteryState) {
  return (
    <div style={{ ...POPUP_STYLE, padding: '10px 14px', whiteSpace: 'nowrap', minWidth: 140 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Battery</div>
      {supported ? (
        <>
          <div style={{ marginBottom: 6 }}>
            {/* Progress bar */}
            <div style={{ height: 8, width: 120, background: 'rgba(0,0,0,0.15)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${level}%`,
                background: charging ? '#3a9d3a' : level < 20 ? '#d43' : '#3a6fd8',
                borderRadius: 2,
                transition: 'width 0.4s',
              }}/>
            </div>
          </div>
          <div>{level}% — {charging ? 'Charging' : 'On battery'}</div>
        </>
      ) : (
        <div style={{ opacity: 0.7 }}>Plugged in</div>
      )}
    </div>
  );
}

// ── Network ───────────────────────────────────────────────────────────────────

function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return online;
}

function NetworkPopup({ online }: { online: boolean }) {
  return (
    <div style={{ ...POPUP_STYLE, padding: '10px 14px', whiteSpace: 'nowrap', minWidth: 120 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Network</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
          background: online ? '#3a9d3a' : '#d43',
        }}/>
        {online ? 'Connected' : 'No internet'}
      </div>
    </div>
  );
}

// ── SystemTray ────────────────────────────────────────────────────────────────

type PopupId = 'volume' | 'battery' | 'network' | null;

export default function SystemTray() {
  // Volume state
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 80;
    return Number(localStorage.getItem(STORAGE_KEY_VOL) ?? 80);
  });
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY_MUTE) === 'true';
  });

  // Popup state
  const [open, setOpen] = useState<PopupId>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  // Battery + network
  const battery = useBattery();
  const online = useOnline();

  // Persist volume
  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    localStorage.setItem(STORAGE_KEY_VOL, String(v));
    if (v > 0) {
      setMuted(false);
      localStorage.setItem(STORAGE_KEY_MUTE, 'false');
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted(m => {
      localStorage.setItem(STORAGE_KEY_MUTE, String(!m));
      return !m;
    });
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (id: PopupId) => setOpen(prev => prev === id ? null : id);

  // Which speaker icon to show
  const SpeakerIcon = muted || volume === 0 ? SpeakerMuted : volume < 50 ? SpeakerLow : SpeakerHigh;

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    cursor: 'pointer',
    borderRadius: 2,
    transition: 'background 0.1s',
  };

  return (
    <div
      ref={trayRef}
      style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, position: 'relative' }}
    >
      {/* Network */}
      <div style={{ position: 'relative' }}>
        <div
          style={iconStyle}
          onClick={() => toggle('network')}
          title={online ? 'Connected' : 'No internet'}
        >
          {online ? <WifiOn /> : <WifiOff />}
        </div>
        {open === 'network' && <NetworkPopup online={online} />}
      </div>

      {/* Volume */}
      <div style={{ position: 'relative' }}>
        <div
          style={iconStyle}
          onClick={() => toggle('volume')}
          title={muted ? 'Volume: Muted' : `Volume: ${volume}%`}
        >
          <SpeakerIcon />
        </div>
        {open === 'volume' && (
          <VolumePopup
            volume={volume}
            muted={muted}
            onChange={handleVolumeChange}
            onToggleMute={handleToggleMute}
          />
        )}
      </div>

      {/* Battery */}
      <div style={{ position: 'relative' }}>
        <div
          style={iconStyle}
          onClick={() => toggle('battery')}
          title={
            battery.supported
              ? `Battery: ${battery.level}% — ${battery.charging ? 'Charging' : 'remaining'}`
              : 'Plugged in'
          }
        >
          <BatteryIcon level={battery.supported ? battery.level : 100} charging={battery.supported ? battery.charging : true} />
        </div>
        {open === 'battery' && <BatteryPopup {...battery} />}
      </div>
    </div>
  );
}
