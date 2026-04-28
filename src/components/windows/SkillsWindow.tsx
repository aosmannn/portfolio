'use client';

import { useState } from 'react';

const SKILLS = [
  { label: 'React / Next.js', pct: 90 },
  { label: 'TypeScript',      pct: 85 },
  { label: 'Swift / iOS',     pct: 75 },
  { label: 'Tailwind CSS',    pct: 90 },
  { label: 'Supabase',        pct: 80 },
  { label: 'Python',          pct: 70 },
  { label: 'Node.js',         pct: 80 },
];

const TIMELINE = [
  { period: '2026–Present', title: 'GaitGuard', desc: 'iOS/watchOS gait monitoring app for Parkinson\'s patients — uses Apple Watch motion sensors to deliver rhythmic haptic cues that help users initiate walking and navigate turns' },
  { period: '2025–Present', title: 'Founder & CEO, CourseConnect AI', desc: 'AI-powered study platform that reads course syllabi, extracts deadlines and grading policies, and provides context-aware tutoring — helping college students outperform rather than just study' },
  { period: '2024–Present', title: 'CS Student, Georgia State University', desc: '' },
  { period: '2025',         title: 'PlanDrop', desc: 'Friend-group activity planner where your crew claims a pre-generated plan from a live pool of AI-curated options in your area — first come, first served' },
];

export default function SkillsWindow() {
  const [tab, setTab] = useState<'skills' | 'experience'>('skills');

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f0f0' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #0078d7', background: '#e8e8e8', flexShrink: 0 }}>
        {(['skills', 'experience'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 20px', border: 'none', cursor: 'pointer', fontSize: 12,
            background: tab === t ? '#ffffff' : 'transparent',
            color: tab === t ? '#0078d7' : '#333',
            fontWeight: tab === t ? 'bold' : 'normal',
            fontFamily: 'Tahoma, sans-serif',
            borderBottom: tab === t ? '2px solid #ffffff' : 'none',
            marginBottom: tab === t ? -2 : 0,
          }}>
            {t === 'skills' ? 'Skills' : 'Experience'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {tab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SKILLS.map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: '#333' }}>
                  <span style={{ fontWeight: 'bold' }}>{s.label}</span>
                  <span style={{ color: '#0078d7' }}>{s.pct}%</span>
                </div>
                <div style={{
                  height: 18, background: '#d4e8f8', borderRadius: 3,
                  border: '1px solid #a8d0f0', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${s.pct}%`, height: '100%',
                    background: 'linear-gradient(180deg, #56b4f7 0%, #0078d7 40%, #005fa3 60%, #1e8ef5 100%)',
                    borderRadius: 2,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'experience' && (
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 7, top: 8, bottom: 8,
              width: 2, background: '#0078d7', opacity: 0.4,
            }} />
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 24 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -20, top: 4,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#0078d7', border: '2px solid #fff',
                  boxShadow: '0 0 0 2px #0078d7',
                }} />
                <div style={{
                  background: '#fff', border: '1px solid #d0e8f8',
                  borderRadius: 4, padding: '10px 14px',
                  boxShadow: '0 1px 4px rgba(0,120,215,0.1)',
                }}>
                  <div style={{ fontSize: 10, color: '#0078d7', fontWeight: 'bold', marginBottom: 2 }}>{item.period}</div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#222', marginBottom: item.desc ? 4 : 0 }}>{item.title}</div>
                  {item.desc && <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>{item.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
