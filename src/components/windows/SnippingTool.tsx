'use client';

import { useCallback, useRef, useState } from 'react';

interface Props { onClose: () => void; }
type Mode = 'idle' | 'captured' | 'selecting' | 'done';
interface Rect { x: number; y: number; w: number; h: number; }

export default function SnippingTool({ onClose: _onClose }: Props) {
  const [mode, setMode] = useState<Mode>('idle');
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [selection, setSelection] = useState<Rect | null>(null);
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  const previewDivRef = useCallback((div: HTMLDivElement | null) => {
    if (!div || !capturedCanvas) return;
    div.innerHTML = '';
    const c = capturedCanvas.cloneNode(true) as HTMLCanvasElement;
    c.style.maxWidth = '100%';
    c.style.display = 'block';
    c.style.cursor = 'crosshair';
    div.appendChild(c);
  }, [capturedCanvas]);

  const handleNewSnip = useCallback(async () => {
    setCapturing(true);
    setError('');
    setSelection(null);
    setCopied(false);
    try {
      // Use Screen Capture API — no npm package needed
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' } as MediaTrackConstraints });
      const video = document.createElement('video');
      video.srcObject = stream;
      await new Promise<void>(res => { video.onloadedmetadata = () => res(); });
      await video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')!.drawImage(video, 0, 0);
      stream.getTracks().forEach(t => t.stop());
      setCapturedCanvas(canvas);
      setMode('captured');
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'NotAllowedError') {
        setError('Screen capture failed. Try allowing screen access.');
      } else {
        setError('Permission denied. Allow screen sharing to use Snipping Tool.');
      }
    } finally {
      setCapturing(false);
    }
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'captured' && mode !== 'done') return;
    const rect = e.currentTarget.getBoundingClientRect();
    startRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isDragging.current = true;
    setSelection(null);
    setMode('selecting');
    e.preventDefault();
  }, [mode]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !startRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    setSelection({ x: Math.min(startRef.current.x, cx), y: Math.min(startRef.current.y, cy), w: Math.abs(cx - startRef.current.x), h: Math.abs(cy - startRef.current.y) });
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    startRef.current = null;
    setMode('done');
  }, []);

  const getCropped = useCallback((): HTMLCanvasElement | null => {
    if (!capturedCanvas) return null;
    if (!selection || selection.w < 4 || selection.h < 4) return capturedCanvas;
    const previewDiv = document.querySelector('.snip-preview') as HTMLElement | null;
    if (!previewDiv) return capturedCanvas;
    const sx = capturedCanvas.width / previewDiv.clientWidth;
    const sy = capturedCanvas.height / (previewDiv.clientWidth * capturedCanvas.height / capturedCanvas.width);
    const out = document.createElement('canvas');
    out.width = Math.round(selection.w * sx);
    out.height = Math.round(selection.h * sy);
    out.getContext('2d')!.drawImage(capturedCanvas, Math.round(selection.x * sx), Math.round(selection.y * sy), out.width, out.height, 0, 0, out.width, out.height);
    return out;
  }, [capturedCanvas, selection]);

  const handleSave = useCallback(() => {
    const c = getCropped();
    if (!c) return;
    const a = document.createElement('a');
    a.download = `snip-${Date.now()}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
  }, [getCropped]);

  const handleCopy = useCallback(async () => {
    const c = getCropped();
    if (!c) return;
    c.toBlob(async blob => {
      if (!blob) return;
      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
    }, 'image/png');
  }, [getCropped]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'linear-gradient(180deg,#f4f6fb,#e8ecf6)', borderBottom: '1px solid rgba(100,140,220,0.3)', flexShrink: 0 }}>
        <button className="xp-push-btn" onClick={handleNewSnip} disabled={capturing}>
          {capturing ? '⏳ Capturing...' : '✂️ New Snip'}
        </button>
        {(mode === 'done' || mode === 'selecting') && capturedCanvas && (
          <>
            <button className="xp-push-btn" onClick={handleSave}>💾 Save PNG</button>
            <button className="xp-push-btn" onClick={handleCopy}>{copied ? '✅ Copied!' : '📋 Copy'}</button>
            <button className="xp-push-btn" onClick={() => { setCapturedCanvas(null); setMode('idle'); setSelection(null); }}>🔄 Reset</button>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: '#668', fontStyle: 'italic' }}>
          {mode === 'idle' ? 'Click New Snip to capture screen' :
           mode === 'captured' ? 'Drag to select a region, then Save or Copy' :
           mode === 'selecting' ? 'Drag to define crop area...' :
           selection ? `${Math.round(selection.w)} × ${Math.round(selection.h)}px — save or copy` : 'Full capture ready'}
        </span>
      </div>

      {/* Content */}
      {mode === 'idle' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}>
          <div style={{ fontSize: 52 }}>✂️</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#001060' }}>Snipping Tool</div>
          {error && <div style={{ fontSize: 11, color: '#c00', textAlign: 'center', maxWidth: 260 }}>{error}</div>}
          <div style={{ fontSize: 11, color: '#668', textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>
            Captures your entire screen using the browser Screen Capture API. You&apos;ll be asked to choose which window or screen to share.
          </div>
          <button onClick={handleNewSnip} disabled={capturing} className="aero-btn" style={{ padding: '7px 24px', fontSize: 12 }}>
            {capturing ? '⏳ Starting capture...' : '✂️ New Snip'}
          </button>
        </div>
      ) : (
        <div
          className="snip-preview"
          ref={previewDivRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ flex: 1, overflow: 'auto', position: 'relative', background: '#111', userSelect: 'none', cursor: mode === 'done' ? 'default' : 'crosshair' }}
        >
          {selection && selection.w > 2 && selection.h > 2 && (
            <div style={{ position: 'absolute', left: selection.x, top: selection.y, width: selection.w, height: selection.h, border: '2px dashed #0078d7', background: 'rgba(0,120,215,0.1)', pointerEvents: 'none', boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', top: -18, left: 0, background: '#0078d7', color: '#fff', fontSize: 9, padding: '1px 4px', borderRadius: 2, whiteSpace: 'nowrap' }}>
                {Math.round(selection.w)} × {Math.round(selection.h)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
