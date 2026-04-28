'use client';

import { useEffect, useState } from 'react';

const SKILLS = [
  { name: 'React / Next.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Swift / SwiftUI', level: 75 },
  { name: 'Python', level: 80 },
  { name: 'Supabase / SQL', level: 75 },
  { name: 'AI / Claude API', level: 85 },
];

const TECH_CATEGORIES = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { label: 'Backend', items: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs'] },
  { label: 'Mobile', items: ['Swift', 'SwiftUI', 'HealthKit', 'WatchConnectivity'] },
  { label: 'AI/ML', items: ['Claude API', 'OpenAI', 'Vector Search', 'Embeddings'] },
];

export default function ResumeWindow() {
  const [widths, setWidths] = useState<number[]>(SKILLS.map(() => 0));

  useEffect(() => {
    const t = setTimeout(() => {
      setWidths(SKILLS.map((s) => s.level));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="win-content">
      <div className="win-section-title">Education</div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 'bold', color: '#003380' }}>Georgia State University</div>
        <div style={{ color: '#444' }}>B.S. Computer Science + Business</div>
        <div style={{ color: '#888', fontSize: 11 }}>Expected Graduation: Fall 2027</div>
      </div>

      <div className="xp-separator" />

      <div className="win-section-title">Skills</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {SKILLS.map((skill, i) => (
          <div key={skill.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span className="xp-label" style={{ marginBottom: 0 }}>{skill.name}</span>
              <span style={{ fontSize: 11, color: '#668' }}>{skill.level}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className="skill-bar-fill"
                style={{ width: `${widths[i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="xp-separator" />

      <div className="win-section-title">Technologies</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {TECH_CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <div className="xp-label">{cat.label}</div>
            <div>
              {cat.items.map((item) => (
                <span key={item} className="xp-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
