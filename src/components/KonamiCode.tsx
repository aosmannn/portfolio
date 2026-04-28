'use client';

import { useEffect, useState } from 'react';

const SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

interface Particle { id: number; x: number; color: string; delay: number; size: number; duration: number; }

export default function KonamiCode() {
  const [progress, setProgress] = useState<string[]>([]);
  const [achieved, setAchieved] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setProgress(prev => {
        const next = [...prev, e.key].slice(-SEQUENCE.length);
        if (next.join(',') === SEQUENCE.join(',')) {
          triggerAchievement();
          return [];
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const triggerAchievement = () => {
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bff','#ff9f43','#00d2d3'];
    const newParticles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: Math.random() * 10 + 6,
      duration: Math.random() * 1.5 + 1.5,
    }));
    setParticles(newParticles);
    setAchieved(true);
    setTimeout(() => { setAchieved(false); setParticles([]); }, 5000);
  };

  if (!achieved && particles.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99000, pointerEvents: achieved ? 'all' : 'none' }}
      onClick={() => { setAchieved(false); setParticles([]); }}>

      {/* Confetti */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: -20,
          width: p.size,
          height: p.size * 0.6,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
          opacity: 0.9,
        }} />
      ))}

      {/* Achievement popup */}
      {achieved && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.9)',
          border: '2px solid gold',
          borderRadius: 12,
          padding: '32px 48px',
          textAlign: 'center',
          color: 'white',
          fontFamily: 'Tahoma, sans-serif',
          boxShadow: '0 0 60px rgba(255,215,0,0.5)',
          animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{ fontSize: 56 }}>🏆</div>
          <div style={{ fontSize: 14, color: 'gold', letterSpacing: 3, marginTop: 8, textTransform: 'uppercase' }}>Achievement Unlocked</div>
          <div style={{ fontSize: 22, fontWeight: 'bold', marginTop: 8 }}>You Know The Konami Code</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>↑↑↓↓←→←→BA — Classic.</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>Click anywhere to continue</div>
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          to   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
