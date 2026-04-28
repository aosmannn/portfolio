let _ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return _ctx;
}
function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.15, delay = 0) {
  const ctx = getCtx(); if (!ctx) return;
  try {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
    osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + dur + 0.05);
  } catch {}
}
export const sounds = {
  click: () => tone(1200, 0.04, 'square', 0.08),
  open: () => { tone(523.25, 0.1, 'sine', 0.15, 0); tone(659.25, 0.1, 'sine', 0.15, 0.07); tone(783.99, 0.18, 'sine', 0.15, 0.14); },
  close: () => { tone(783.99, 0.08, 'sine', 0.15, 0); tone(659.25, 0.08, 'sine', 0.15, 0.07); tone(523.25, 0.15, 'sine', 0.15, 0.14); },
  minimize: () => tone(880, 0.06, 'sine', 0.1),
  startup: () => { [[392,0,0.3],[523.25,0.12,0.3],[659.25,0.24,0.3],[783.99,0.36,0.25],[1046.5,0.48,0.6],[783.99,0.7,0.1],[1046.5,0.82,0.9]].forEach(([f,t,d]) => tone(f,d,'sine',0.18,t)); },
  error: () => { tone(200, 0.12, 'sawtooth', 0.15, 0); tone(180, 0.25, 'sawtooth', 0.15, 0.12); },
};
