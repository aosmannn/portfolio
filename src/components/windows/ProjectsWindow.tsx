'use client';

import { useEffect, useState } from 'react';
import { projects } from '@/data/projects';

interface ProjectsWindowProps {
  onOpenProject: (href: string) => void;
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

const STATUS_CLASS: Record<string, string> = {
  live: 'status-live',
  'coming-soon': 'status-coming-soon',
  'open-source': 'status-open-source',
};

const STATUS_LABEL: Record<string, string> = {
  live: '● Live',
  'coming-soon': '◐ Coming Soon',
  'open-source': '⊕ Open Source',
};

const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Swift: '#F05138',
  Rust: '#dea584',
  Go: '#00ADD8',
  CSS: '#563d7c',
  HTML: '#e34c26',
};

export default function ProjectsWindow({ onOpenProject }: ProjectsWindowProps) {
  const [tab, setTab] = useState<'featured' | 'github'>('featured');
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'github' && repos.length === 0) {
      setLoading(true);
      fetch('/api/github-repos')
        .then((r) => r.json())
        .then((data: GHRepo[]) => {
          setRepos(data.filter((r) => !r.fork && r.name !== 'portfolio'));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [tab, repos.length]);

  return (
    <div className="win-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '2px solid #5090d0',
        background: 'linear-gradient(180deg, #ddeeff 0%, #c8dff8 100%)',
        padding: '6px 10px 0',
        flexShrink: 0,
      }}>
        {(['featured', 'github'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: 'Tahoma, sans-serif',
              fontSize: 11,
              fontWeight: tab === t ? 'bold' : 'normal',
              padding: '4px 14px',
              background: tab === t ? 'white' : 'transparent',
              border: '1px solid',
              borderColor: tab === t ? '#5090d0 #5090d0 white #5090d0' : 'transparent',
              borderBottom: tab === t ? '2px solid white' : 'none',
              borderRadius: '3px 3px 0 0',
              cursor: 'pointer',
              color: tab === t ? '#003380' : '#336',
              marginBottom: tab === t ? -2 : 0,
              position: 'relative',
            }}
          >
            {t === 'featured' ? '⭐ Featured' : '🐙 GitHub'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {tab === 'featured' && (
          <>
            <div className="win-section-title">Featured Projects</div>
            {projects.map((p) => (
              <div key={p.title} className="project-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 13, color: '#003380' }}>{p.title}</div>
                  <span className={`project-status ${STATUS_CLASS[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px', lineHeight: 1.5, color: '#333' }}>{p.description}</p>
                <div style={{ marginBottom: 8 }}>
                  {p.stack.map((s) => (
                    <span key={s} className="xp-tag">{s}</span>
                  ))}
                </div>
                <button
                  className="aero-btn"
                  disabled={p.href === '#'}
                  onClick={() => p.href !== '#' && onOpenProject(p.href)}
                  style={p.href === '#' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  {p.href === '#' ? '🔒 Coming Soon' : '🔗 Open Project'}
                </button>
              </div>
            ))}
          </>
        )}

        {tab === 'github' && (
          <>
            <div className="win-section-title">GitHub Repositories</div>
            {loading ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 12 }}>
                Loading repositories...
              </div>
            ) : repos.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 12 }}>
                No repositories found.
              </div>
            ) : (
              repos.map((repo) => (
                <div key={repo.id} className="project-card" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 12, color: '#003380' }}>
                      {repo.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {repo.language && (
                        <span style={{
                          fontSize: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          color: '#444',
                        }}>
                          <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: LANG_COLOR[repo.language] ?? '#888',
                            display: 'inline-block',
                          }} />
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span style={{ fontSize: 10, color: '#666' }}>⭐ {repo.stargazers_count}</span>
                      )}
                    </div>
                  </div>
                  {repo.description && (
                    <p style={{ margin: '0 0 8px', fontSize: 11, lineHeight: 1.5, color: '#444' }}>
                      {repo.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#888' }}>
                      Updated {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      className="aero-btn"
                      style={{ fontSize: 11, padding: '3px 12px' }}
                      onClick={() => onOpenProject(repo.html_url)}
                    >
                      View on GitHub
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
