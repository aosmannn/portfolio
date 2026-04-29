'use client';

interface WallpaperPickerProps {
  onClose: () => void;
  onSelect: (wallpaper: string) => void;
  current: string;
}

const WALLPAPERS = [
  { id: '/aero.jpg', label: 'Windows Aero' },
  { id: '/windows7.jpeg', label: 'Windows 7' },
  { id: '/fruit.jpeg', label: 'Fruit' },
];

export default function WallpaperPicker({ onClose, onSelect, current }: WallpaperPickerProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9900,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #d8e8f8 0%, #c0d4ec 100%)',
          border: '1px solid rgba(100,140,220,0.7)',
          borderRadius: 8,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          width: 480,
          fontFamily: 'Tahoma, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div style={{
          background: 'linear-gradient(180deg, #bad4f0 0%, #8ab4e0 100%)',
          padding: '6px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(80,120,200,0.4)',
        }}>
          <span style={{ fontWeight: 'bold', fontSize: 12, color: '#001860' }}>
            🎨 Personalization — Desktop Background
          </span>
          <button
            onClick={onClose}
            style={{
              width: 22, height: 20, borderRadius: 5,
              background: 'linear-gradient(180deg, #ff8080 0%, #e03030 50%, #c01818 100%)',
              border: '1px solid rgba(160,20,20,0.7)',
              color: 'white', fontSize: 10, cursor: 'pointer', fontWeight: 'bold',
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: '#003380', marginBottom: 14, fontWeight: 'bold' }}>
            Choose a desktop background:
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            {WALLPAPERS.map(wp => (
              <div
                key={wp.id}
                onClick={() => { onSelect(wp.id); }}
                style={{
                  cursor: 'pointer',
                  border: current === wp.id ? '3px solid #0078d7' : '3px solid transparent',
                  borderRadius: 4,
                  outline: current === wp.id ? '1px solid #005999' : '1px solid #aac4e0',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={wp.id}
                  alt={wp.label}
                  style={{ width: 130, height: 82, objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  textAlign: 'center', fontSize: 11, padding: '4px 0',
                  background: current === wp.id ? '#0078d7' : '#e8f0f8',
                  color: current === wp.id ? 'white' : '#003380',
                }}>
                  {wp.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                fontFamily: 'Tahoma, sans-serif', fontSize: 12, padding: '4px 20px',
                background: 'linear-gradient(180deg, #f8f8f8 0%, #ddd 100%)',
                border: '1px solid #888', borderRadius: 3, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              style={{
                fontFamily: 'Tahoma, sans-serif', fontSize: 12, padding: '4px 20px',
                background: 'linear-gradient(180deg, #7ab4f0 0%, #2878d0 100%)',
                border: '1px solid #1060b0', borderRadius: 3, cursor: 'pointer',
                color: 'white', fontWeight: 'bold',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
