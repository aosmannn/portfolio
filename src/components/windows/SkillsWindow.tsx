'use client';

import { useState, useEffect } from 'react';

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

interface WakaLang { name: string; percent: number; text: string; }
interface WakaEditor { name: string; percent: number; text: string; }
interface WakaProject { name: string; percent: number; text: string; }
interface WakaData {
  data?: {
    human_readable_total?: string;
    human_readable_daily_average?: string;
    languages?: WakaLang[];
    editors?: WakaEditor[];
    projects?: WakaProject[];
  };
}

function WakaStats() {
  const [data, setData] = useState<WakaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/wakatime')
      .then(r => r.json())
      .then(json => {
        if (json?.data) setData(json);
        else setFailed(true);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 12 }}>Loading coding stats...</div>;
  }

  if (failed || !data?.data) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>⏱️</div>
        <div style={{ fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>Stats loading... check back soon</div>
        <div style={{ fontSize: 11, color: '#888' }}>Coding stats are fetched live from WakaTime.</div>
      </div>
    );
  }

  const { human_readable_total, human_readable_daily_average, languages = [], editors = [], projects = [] } = data.data;
  const topLangs = languages.slice(0, 5);
  const topEditors = editors.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Total time */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #d0e8f8', borderRadius: 6, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,120,215,0.08)' }}>
          <div style={{ fontSize: 10, color: '#0078d7', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>This Week</div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003380' }}>{human_readable_total ?? '—'}</div>
          <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>total coding time</div>
        </div>
        {human_readable_daily_average && (
          <div style={{ flex: 1, background: '#fff', border: '1px solid #d0e8f8', borderRadius: 6, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,120,215,0.08)' }}>
            <div style={{ fontSize: 10, color: '#0078d7', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Daily Avg</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003380' }}>{human_readable_daily_average}</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>per day</div>
          </div>
        )}
      </div>

      {/* Languages */}
      {topLangs.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top Languages</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topLangs.map(lang => (
              <div key={lang.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11, color: '#333' }}>
                  <span style={{ fontWeight: 'bold' }}>{lang.name}</span>
                  <span style={{ color: '#0078d7' }}>{lang.percent.toFixed(1)}%</span>
                </div>
                <div style={{ height: 14, background: '#d4e8f8', borderRadius: 3, border: '1px solid #a8d0f0', overflow: 'hidden' }}>
                  <div style={{
                    width: `${lang.percent}%`, height: '100%',
                    background: 'linear-gradient(180deg, #56b4f7 0%, #0078d7 40%, #005fa3 60%, #1e8ef5 100%)',
                    borderRadius: 2,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editors */}
      {topEditors.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top Editors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topEditors.map(editor => (
              <div key={editor.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#fff', border: '1px solid #d0e8f8', borderRadius: 4,
                padding: '6px 12px', fontSize: 11,
              }}>
                <span style={{ fontWeight: 'bold', color: '#222' }}>{editor.name}</span>
                <span style={{ color: '#0078d7' }}>{editor.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.slice(0, 5).length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top Projects</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {projects.slice(0, 5).map((proj: WakaProject) => (
              <div key={proj.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#fff', border: '1px solid #d0e8f8', borderRadius: 4,
                padding: '6px 12px', fontSize: 11,
              }}>
                <span style={{ fontWeight: 'bold', color: '#222' }}>{proj.name}</span>
                <span style={{ color: '#0078d7' }}>{proj.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SkillsWindow() {
  const [tab, setTab] = useState<'experience' | 'coding'>('experience');

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'coding', label: '⏱️ Coding Stats' },
  ];

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f0f0' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #0078d7', background: '#e8e8e8', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '6px 16px', border: 'none', cursor: 'pointer', fontSize: 12,
            background: tab === t.id ? '#ffffff' : 'transparent',
            color: tab === t.id ? '#0078d7' : '#333',
            fontWeight: tab === t.id ? 'bold' : 'normal',
            fontFamily: 'Tahoma, sans-serif',
            borderBottom: tab === t.id ? '2px solid #ffffff' : 'none',
            marginBottom: tab === t.id ? -2 : 0,
            whiteSpace: 'nowrap',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        

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

        {tab === 'coding' && <WakaStats />}
      </div>
    </div>
  );
}
