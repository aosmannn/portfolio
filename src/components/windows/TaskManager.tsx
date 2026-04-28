'use client';

import { useEffect, useState } from 'react';

interface Process { name: string; pid: number; cpu: number; mem: number; status: string; }

const BASE_PROCESSES: Omit<Process, 'cpu' | 'mem'>[] = [
  { name: 'react.exe',              pid: 1337, status: 'Running' },
  { name: 'nextjs.exe',             pid: 1338, status: 'Running' },
  { name: 'typescript.exe',         pid: 1339, status: 'Running' },
  { name: 'tailwind.exe',           pid: 1340, status: 'Running' },
  { name: 'supabase.exe',           pid: 1341, status: 'Running' },
  { name: 'spotify-api.exe',        pid: 1342, status: 'Running' },
  { name: 'coffee.exe',             pid: 430,  status: 'Not Responding' },
  { name: 'sleep.exe',              pid: 9999, status: 'Suspended'   },
  { name: 'coursework.exe',         pid: 2024, status: 'Running' },
  { name: 'courseconnectai.exe',    pid: 2025, status: 'Running' },
  { name: 'gaitguard.exe',          pid: 2026, status: 'Running' },
  { name: 'vercel-deploy.exe',      pid: 9001, status: 'Running' },
  { name: 'imposter-syndrome.exe',  pid: 6666, status: 'Terminated'  },
  { name: 'debugger.exe',           pid: 3141, status: 'Running' },
  { name: 'git-commit.exe',         pid: 4200, status: 'Running' },
];

function randBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function TaskManager() {
  const [processes, setProcesses] = useState<Process[]>(() =>
    BASE_PROCESSES.map(p => ({
      ...p,
      cpu: p.status === 'Not Responding' ? 100 : p.status === 'Terminated' ? 0 : Math.floor(randBetween(0, 35)),
      mem: Math.floor(randBetween(20, 280)),
    }))
  );
  const [tab, setTab] = useState<'processes' | 'performance'>('processes');
  const [sortCol, setSortCol] = useState<'name' | 'cpu' | 'mem'>('cpu');
  const [sortAsc, setSortAsc] = useState(false);
  const [totalCpu, setTotalCpu] = useState(42);
  const [totalMem, setTotalMem] = useState(6.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: p.status === 'Not Responding' ? 100
          : p.status === 'Terminated' ? 0
          : p.status === 'Suspended' ? 0
          : Math.max(0, p.cpu + (Math.random() - 0.5) * 8),
        mem: Math.max(10, p.mem + (Math.random() - 0.5) * 5),
      })));
      setTotalCpu(c => Math.max(10, Math.min(95, c + (Math.random() - 0.5) * 6)));
      setTotalMem(m => Math.max(2, Math.min(7.8, m + (Math.random() - 0.45) * 0.1)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...processes].sort((a, b) => {
    const v = sortCol === 'name'
      ? a.name.localeCompare(b.name)
      : sortCol === 'cpu' ? a.cpu - b.cpu : a.mem - b.mem;
    return sortAsc ? v : -v;
  });

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(false); }
  };

  const thStyle = (col: typeof sortCol): React.CSSProperties => ({
    padding: '4px 8px', textAlign: 'left', fontWeight: 'bold', fontSize: 10,
    color: '#334', cursor: 'pointer', userSelect: 'none',
    background: sortCol === col ? '#dde4f8' : '#e8ecf6',
    borderRight: '1px solid rgba(100,140,220,0.2)',
    whiteSpace: 'nowrap',
  });

  const CpuBar = ({ value }: { value: number }) => (
    <div style={{ width: 60, height: 8, background: '#dde4ff', borderRadius: 2, overflow: 'hidden', display: 'inline-block', marginLeft: 6, verticalAlign: 'middle' }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: '100%', background: value > 80 ? '#e03030' : value > 50 ? '#f0a020' : '#1DB954', borderRadius: 2, transition: 'width 0.5s' }} />
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif', fontSize: 11 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', background: '#e0e6f8', borderBottom: '1px solid rgba(100,140,220,0.3)', flexShrink: 0 }}>
        {(['processes', 'performance'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '5px 16px', cursor: 'pointer', border: 'none', fontFamily: 'Tahoma, sans-serif', fontSize: 11,
            background: tab === t ? 'white' : 'transparent',
            borderBottom: tab === t ? '2px solid #0078d7' : '2px solid transparent',
            color: tab === t ? '#0078d7' : '#556', fontWeight: tab === t ? 'bold' : 'normal',
          }}>
            {t === 'processes' ? '⚙️ Processes' : '📊 Performance'}
          </button>
        ))}
      </div>

      {tab === 'processes' ? (
        <>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 80px', background: '#e8ecf6', borderBottom: '1px solid rgba(100,140,220,0.3)', flexShrink: 0 }}>
            <div style={thStyle('name')} onClick={() => handleSort('name')}>Image Name {sortCol === 'name' ? (sortAsc ? '▲' : '▼') : ''}</div>
            <div style={{ ...thStyle('cpu'), textAlign: 'right' }} onClick={() => handleSort('cpu')}>CPU {sortCol === 'cpu' ? (sortAsc ? '▲' : '▼') : ''}</div>
            <div style={{ ...thStyle('mem'), textAlign: 'right' }} onClick={() => handleSort('mem')}>Memory {sortCol === 'mem' ? (sortAsc ? '▲' : '▼') : ''}</div>
            <div style={{ ...thStyle('name'), cursor: 'default' }}>Graph</div>
            <div style={{ ...thStyle('name'), cursor: 'default' }}>Status</div>
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {sorted.map((p, i) => (
              <div key={p.pid} style={{
                display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 80px',
                padding: '3px 0', borderBottom: '1px solid rgba(180,200,240,0.2)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(240,244,255,0.4)',
                alignItems: 'center',
              }}>
                <div style={{ padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: p.status === 'Not Responding' ? '#c00' : p.status === 'Terminated' ? '#999' : '#001060' }}>{p.name}</div>
                <div style={{ textAlign: 'right', padding: '0 8px', color: p.cpu > 80 ? '#c00' : '#334' }}>{p.cpu.toFixed(1)}%</div>
                <div style={{ textAlign: 'right', padding: '0 8px', color: '#334' }}>{p.mem.toFixed(0)} MB</div>
                <div style={{ padding: '0 4px' }}><CpuBar value={p.cpu} /></div>
                <div style={{ padding: '0 8px', color: p.status === 'Not Responding' ? '#c00' : p.status === 'Terminated' ? '#999' : p.status === 'Suspended' ? '#888' : '#060' }}>{p.status}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '4px 8px', background: '#e8ecf6', borderTop: '1px solid rgba(100,140,220,0.3)', display: 'flex', gap: 24, fontSize: 10, color: '#556', flexShrink: 0 }}>
            <span>Processes: {processes.length}</span>
            <span>CPU Usage: {totalCpu.toFixed(0)}%</span>
            <span>Commit Charge: {(totalMem * 1024).toFixed(0)} MB / 8192 MB</span>
          </div>
        </>
      ) : (
        /* Performance tab */
        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'CPU Usage', value: totalCpu, unit: '%', color: '#0078d7' },
            { label: 'Memory', value: (totalMem / 8) * 100, unit: `${totalMem.toFixed(1)} / 8 GB`, color: '#7030a0' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} style={{ background: '#0a0a1e', border: '1px solid rgba(100,140,220,0.3)', borderRadius: 4, padding: 12 }}>
              <div style={{ color: '#80c0ff', fontSize: 11, marginBottom: 8 }}>{label}</div>
              <div style={{ height: 80, background: '#050510', border: '1px solid rgba(100,140,220,0.2)', borderRadius: 2, position: 'relative', overflow: 'hidden', marginBottom: 8 }}>
                {/* Simple bar viz */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${value}%`, background: color, opacity: 0.6, transition: 'height 1s' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{typeof unit === 'string' && unit.includes('/') ? unit : `${value.toFixed(0)}${unit}`}</span>
                </div>
              </div>
              {typeof unit === 'string' && unit.includes('/') && (
                <div style={{ fontSize: 9, color: '#4080c0' }}>{unit}</div>
              )}
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1', background: '#0a0a1e', border: '1px solid rgba(100,140,220,0.3)', borderRadius: 4, padding: 12 }}>
            <div style={{ color: '#80c0ff', fontSize: 11, marginBottom: 8 }}>System Info</div>
            {[
              ['OS', 'Windows 7 (adamosman.dev edition)'],
              ['Runtime', 'Next.js 16 + React 19'],
              ['Uptime', 'since conception (19 years)'],
              ['Developer', 'Adam Osman — Georgia State University'],
              ['Status', '🟢 Available for hire'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 4, fontSize: 10 }}>
                <span style={{ color: '#4080c0', width: 80, flexShrink: 0 }}>{k}:</span>
                <span style={{ color: '#a0c0ff' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
