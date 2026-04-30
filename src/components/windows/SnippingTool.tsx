'use client';

import { useCallback, useRef, useState } from 'react';

interface Props { onClose: () => void; }

type Mode = 'idle' | 'captured' | 'selecting' | 'done';

interface Rect { x: number; y: number; w: number; h: number; }

export default function SnippingTool({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('idle');
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [selection, setSelection] = useState<Rect | null>(null);
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  const handleNewSnip = useCallback(async () => {
    setCapturing(true);
    setSelection(null);
    setCopied(false);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(document.body, { useCORS: true, allowTaint: true, logging: false });
      setCapturedCanvas(canvas);
      setMode('captured');
    } catch (err) {
      console.error('html2canvas error:', err);
    } finally {
      setCapturing(false);
    }
  }, []);

  // Draw canvas into preview when captured
  const previewDivRef = useCallback((div: HTMLDivElement | null) => {
    if (!div || !capturedCanvas) return;
    div.innerHTML = '';
    capturedCanvas.style.maxWidth = '100%';
    capturedCanvas.style.display = 'block';
    capturedCanvas.style.cursor = 'crosshair';
    div.appendChild(capturedCanvas);
  }, [capturedCanvas]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'captured' && mode !== 'selecting') return;
    const rect = e.currentTarget.getBoundingClientRect();
    startRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isDragging.current = true;
    setMode('selecting');
    setSelection(null);
    e.preventDefault();
  }, [mode]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !startRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setSelection({
      x: Math.min(startRef.current.x, cx),
      y: Math.min(startRef.current.y, cy),
      w: Math.abs(cx - startRef.current.x),
      h: Math.abs(cy - startRef.current.y),
    });
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    startRef.current = null;
    setMode('done');
  }, []);

  const getCroppedCanvas = useCallback((): HTMLCanvasElement | null => {
    if (!capturedCanvas) return null;
    const previewDiv = document.querySelector('.snip-preview-area') as HTMLDivElement | null;
    if (!previewDiv) return null;

    // Scale factor between actual canvas pixels and displayed size
    const displayWidth = previewDiv.clientWidth;
    const scaleX = capturedCanvas.width / displayWidth;
    const scaleY = capturedCanvas.height / (displayWidth * capturedCanvas.height / capturedCanvas.width);

    if (selection && selection.w > 4 && selection.h > 4) {
      const out = document.createElement('canvas');
      out.width = Math.round(selection.w * scaleX);
      out.height = Math.round(selection.h * scaleY);
      const ctx = out.getContext('2d')!;
      ctx.drawImage(
        capturedCanvas,
        Math.round(selection.x * scaleX), Math.round(selection.y * scaleY),
        out.width, out.height,
        0, 0, out.width, out.height
      );
      return out;
    }
    return capturedCanvas;
  }, [capturedCanvas, selection]);

  const handleSave = useCallback(() => {
    const canvas = getCroppedCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `snip-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [getCroppedCanvas]);

  const handleCopy = useCallback(async () => {
    const canvas = getCroppedCanvas();
    if (!canvas) return;
    try {
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) { reject(new Error('No blob')); return; }
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            resolve();
          } catch (e) { reject(e); }
        }, 'image/png');
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [getCroppedCanvas]);

  const handleReset = useCallback(() => {
    setCapturedCanvas(null);
    setSelection(null);
    setMode('idle');
    setCopied(false);
  }, []);

  if (mode === 'idle') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Tahoma, sans-serif', padding: 24 }}>
        <div style={{ fontSize: 56 }}>✂️</div>
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#001060' }}>Snipping Tool</div>
        <div style={{ fontSize: 11, color: '#668', textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>
          Click New Snip to capture the screen. Then drag a selection to crop before saving.
        </div>
        <button
          onClick={handleNewSnip}
          disabled={capturing}
          className="aero-btn"
          style={{ padding: '8px 28px', fontSize: 13, opacity: capturing ? 0.7 : 1 }}
        >
          {capturing ? '⏳ Capturing...' : '✂️ New Snip'}
        </button>
        <div style={{ fontSize: 10, color: '#99a', textAlign: 'center' }}>
          Captures a screenshot of the full page
        </div>
      </div>
    );
  }

  // Captured / selecting / done — show preview
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
        background: 'linear-gradient(180deg, #f4f6fb 0%, #e8ecf6 100%)',
        borderBottom: '1px solid rgba(100,140,220,0.3)',
        flexShrink: 0,
      }}>
        <button className="xp-push-btn" onClick={handleNewSnip} disabled={capturing} style={{ fontSize: 11 }}>
          {capturing ? '⏳ Capturing...' : '✂️ New Snip'}
        </button>
        {mode === 'done' && (
          <>
            <button className="xp-push-btn" onClick={handleSave} style={{ fontSize: 11 }}>
              💾 Save PNG
            </button>
            <button className="xp-push-btn" onClick={handleCopy} style={{ fontSize: 11 }}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button className="xp-push-btn" onClick={handleReset} style={{ fontSize: 11 }}>
              🔄 New Snip
            </button>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: '#668', fontStyle: 'italic' }}>
          {mode === 'captured' ? 'Drag to select a region — or click Save to capture full page' :
           mode === 'selecting' ? 'Drag to define selection...' :
           mode === 'done' ? (selection ? `Selection: ${Math.round(selection.w)} × ${Math.round(selection.h)} px` : 'Full capture ready') :
           'Click New Snip to begin'}
        </span>
      </div>

      {/* Preview area */}
      <div
        className="snip-preview-area"
        ref={previewDivRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          cursor: mode === 'captured' || mode === 'selecting' ? 'crosshair' : 'default',
          background: '#1a1a2e',
          userSelect: 'none',
        }}
      >
        {/* Selection overlay */}
        {selection && selection.w > 2 && selection.h > 2 && (
          <div
            style={{
              position: 'absolute',
              left: selection.x, top: selection.y,
              width: selection.w, height: selection.h,
              border: '2px dashed #0078d7',
              background: 'rgba(0,120,215,0.08)',
              pointerEvents: 'none',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              position: 'absolute', top: -20, left: 0,
              background: '#0078d7', color: 'white',
              fontSize: 10, padding: '2px 5px', borderRadius: 2,
              fontFamily: 'Tahoma, sans-serif', whiteSpace: 'nowrap',
            }}>
              {Math.round(selection.w)} × {Math.round(selection.h)} px
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '3px 10px',
        background: 'linear-gradient(180deg, #e8ecf6 0%, #dde4f4 100%)',
        borderTop: '1px solid rgba(100,140,220,0.3)',
        fontSize: 10, color: '#556', flexShrink: 0,
      }}>
        {mode === 'done' && !selection ? 'Full screenshot captured — click Save PNG or draw a selection first' :
         mode === 'done' ? 'Selection ready — Save PNG or Copy to clipboard' :
         'Draw a rectangle on the screenshot to select a region'}
      </div>
    </div>
  );
}
