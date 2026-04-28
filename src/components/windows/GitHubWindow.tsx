'use client';

import { useEffect, useState } from 'react';

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: { length: number }[];
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { merged: boolean };
  };
  created_at: string;
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function describeEvent(event: GitHubEvent): { icon: string; text: string } | null {
  const repo = event.repo.name.replace('aosmannn/', '');
  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload.commits?.length ?? 0;
      return { icon: '📦', text: `Pushed ${count} commit${count !== 1 ? 's' : ''} to ${repo}` };
    }
    case 'CreateEvent':
      return { icon: '🌿', text: `Created ${event.payload.ref_type} ${event.payload.ref ? `"${event.payload.ref}"` : ''} in ${repo}` };
    case 'PullRequestEvent': {
      const merged = event.payload.pull_request?.merged;
      const action = merged ? 'merged' : event.payload.action;
      return { icon: '🔀', text: `PR ${action} in ${repo}` };
    }
    case 'IssuesEvent':
      return { icon: '🐛', text: `Issue ${event.payload.action} in ${repo}` };
    case 'WatchEvent':
      return { icon: '⭐', text: `Starred ${repo}` };
    default:
      return null;
  }
}

export default function GitHubWindow() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/github-activity')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const rows = events
    .map(e => ({ event: e, desc: describeEvent(e) }))
    .filter(x => x.desc !== null)
    .slice(0, 12);

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', height: '100%', display: 'flex', flexDirection: 'column', background: '#f0f0f0' }}>
      {/* Header */}
      <div style={{ padding: '10px 16px 8px', background: '#e8f0fb', borderBottom: '1px solid #c8d8f0', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003380' }}>🐙 Recent Activity</div>
        <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>aosmannn · last 15 events</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {loading && (
          <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 12 }}>
            Loading activity...
          </div>
        )}
        {error && !loading && (
          <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 12 }}>
            Could not load GitHub activity.
          </div>
        )}
        {!loading && !error && rows.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 12 }}>
            No recent public activity.
          </div>
        )}
        {rows.map(({ event, desc }) => (
          <div key={event.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '7px 16px',
            background: '#fff',
            borderBottom: '1px solid #e8f0fb',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{desc!.icon}</span>
            <span style={{ flex: 1, fontSize: 11, color: '#222', lineHeight: 1.5 }}>{desc!.text}</span>
            <span style={{ fontSize: 10, color: '#0078d7', flexShrink: 0, marginTop: 2 }}>{timeAgo(event.created_at)}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #c8d8f0', background: '#e8f0fb', flexShrink: 0 }}>
        <a
          href="https://github.com/aosmannn"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: '#0078d7', textDecoration: 'none', fontFamily: 'Tahoma, sans-serif' }}
        >
          View full profile →
        </a>
      </div>
    </div>
  );
}
