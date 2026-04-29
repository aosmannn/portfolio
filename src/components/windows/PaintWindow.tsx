'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = [
  '#000000', '#ffffff', '#808080', '#c0c0c0',
  '#ff0000', '#800000', '#ff8000', '#804000',
  '#ffff00', '#808000', '#00ff00', '#008000',
  '#00ffff', '#008080', '#0000ff', '#000080',
  '#ff00ff', '#800080', '#ff80ff', '#8080ff',
];

type Tool = 'pencil' | 'eraser';

export default function PaintWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.beginPath();
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };
  }, [tool, color, brushSize]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const pos = getPos(e);
    lastPos.current = null;
    draw(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const pos = getPos(e);
    draw(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const btnStyle = (active: boolean) => ({
    padding: '3px 10px',
    background: active
      ? 'linear-gradient(180deg, #b0c8f0 0%, #8aacdc 100%)'
      : 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)',
    border: `1px solid ${active ? '#5080c0' : '#aaa'}`,
    borderRadius: 2,
    fontSize: 11,
    fontFamily: 'Tahoma, sans-serif',
    cursor: 'pointer',
    boxShadow: active ? 'inset 0 1px 2px rgba(0,0,0,0.2)' : 'none',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f0f0', fontFamily: 'Tahoma, sans-serif' }}>
      {/* Toolbar */}
      <div style={{
        background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
        borderBottom: '1px solid #c0c0c0',
        padding: '4px 8px',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <button style={btnStyle(tool === 'pencil')} onClick={() => setTool('pencil')}>✏️ Pencil</button>
        <button style={btnStyle(tool === 'eraser')} onClick={() => setTool('eraser')}>🧹 Eraser</button>

        <div style={{ width: 1, height: 24, background: '#c0c0c0' }} />

        <label style={{ fontSize: 11, color: '#333' }}>Size:</label>
        <input
          type="range" min={1} max={30} value={brushSize}
          onChange={e => setBrushSize(Number(e.target.value))}
          style={{ width: 80 }}
        />
        <span style={{ fontSize: 11, color: '#333', minWidth: 20 }}>{brushSize}</span>

        <div style={{ width: 1, height: 24, background: '#c0c0c0' }} />

        <button
          onClick={clearCanvas}
          style={{ ...btnStyle(false), color: '#c00', borderColor: '#c88' }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Color palette */}
      <div style={{
        background: 'linear-gradient(180deg, #f0f0f0 0%, #e4e4e4 100%)',
        borderBottom: '1px solid #c0c0c0',
        padding: '4px 8px',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <span style={{ fontSize: 11, color: '#333', marginRight: 4 }}>Color:</span>
        {COLORS.map(c => (
          <div
            key={c}
            onClick={() => { setColor(c); setTool('pencil'); }}
            style={{
              width: 18, height: 18,
              background: c,
              border: color === c && tool === 'pencil' ? '2px solid #0078d7' : '1px solid #888',
              borderRadius: 2,
              cursor: 'pointer',
              boxShadow: color === c && tool === 'pencil' ? '0 0 4px rgba(0,120,215,0.6)' : 'none',
              flexShrink: 0,
            }}
          />
        ))}
        {/* Custom color */}
        <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <label style={{ fontSize: 11, color: '#333' }}>Custom:</label>
          <input
            type="color" value={color}
            onChange={e => { setColor(e.target.value); setTool('pencil'); }}
            style={{ width: 28, height: 22, border: '1px solid #888', cursor: 'pointer', padding: 0 }}
          />
        </div>

        {/* Current color preview */}
        <div style={{
          width: 32, height: 20, background: color,
          border: '2px inset #888', marginLeft: 8,
        }} />
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, overflow: 'auto', background: '#808080', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 8 }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            display: 'block',
            cursor: tool === 'eraser' ? 'cell' : 'crosshair',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            maxWidth: '100%',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Status bar */}
      <div style={{
        background: '#f0f0f0', borderTop: '1px solid #c0c0c0',
        padding: '2px 8px', fontSize: 11, color: '#555',
      }}>
        Tool: {tool === 'eraser' ? 'Eraser' : 'Pencil'} &nbsp;|&nbsp; Color: {color} &nbsp;|&nbsp; Size: {brushSize}px
      </div>
    </div>
  );
}
