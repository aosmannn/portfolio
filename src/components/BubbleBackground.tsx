'use client';

export default function BubbleBackground() {
  return (
    <>
      {/* Win7 light streak — top-left */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.55 }} xmlns="http://www.w3.org/2000/svg">
        <line x1="-5%" y1="28%" x2="55%" y2="68%" stroke="white" strokeWidth="1" opacity="0.35"/>
        <line x1="-5%" y1="32%" x2="50%" y2="72%" stroke="white" strokeWidth="0.5" opacity="0.2"/>
        <line x1="2%" y1="18%" x2="48%" y2="62%" stroke="white" strokeWidth="0.5" opacity="0.15"/>
        <radialGradient id="flare" cx="18%" cy="42%" r="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <ellipse cx="18%" cy="42%" rx="28%" ry="22%" fill="url(#flare)"/>
      </svg>

      {/* Win7 Windows logo watermark — center */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '55%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        opacity: 0.12,
        width: 'min(520px, 55vw)',
        height: 'min(520px, 55vw)',
      }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Top-left panel — red/orange */}
          <path d="M8 42 C8 42 88 30 92 30 L92 95 L8 95 Z" fill="white"/>
          {/* Top-right panel — green */}
          <path d="M96 28 C96 28 192 14 192 14 L192 95 L96 95 Z" fill="white"/>
          {/* Bottom-left panel — blue */}
          <path d="M8 105 L92 105 L92 170 C92 170 8 158 8 158 Z" fill="white"/>
          {/* Bottom-right panel — yellow */}
          <path d="M96 105 L192 105 L192 186 C192 186 96 172 96 172 Z" fill="white"/>
        </svg>
      </div>

      {/* Bottom-left plant sparkle (Win7 detail) */}
      <svg style={{ position: 'absolute', bottom: 60, left: '8%', pointerEvents: 'none', opacity: 0.3 }} width="120" height="80" viewBox="0 0 120 80">
        <path d="M20 80 Q30 40 60 20 Q45 50 70 35 Q55 60 80 45 Q60 65 90 55" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <circle cx="62" cy="18" r="2" fill="white" opacity="0.8"/>
        <circle cx="82" cy="43" r="1.5" fill="white" opacity="0.6"/>
        <circle cx="48" cy="30" r="1" fill="white" opacity="0.5"/>
        {/* Sparkle star */}
        <path d="M20 55 L21 52 L22 55 L25 56 L22 57 L21 60 L20 57 L17 56 Z" fill="white" opacity="0.7"/>
        <path d="M95 22 L96 19 L97 22 L100 23 L97 24 L96 27 L95 24 L92 23 Z" fill="white" opacity="0.5"/>
      </svg>
    </>
  );
}
