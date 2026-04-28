'use client';

import { useEffect, useState } from 'react';
import { getHistory, type HistoryTrack } from '@/lib/playlistHistory';

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function PlaylistHistory() {
  const [tracks, setTracks] = useState<HistoryTrack[]>([]);

  useEffect(() => {
    setTracks(getHistory());
    const interval = setInterval(() => setTracks(getHistory()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '8px 12px', background: 'linear-gradient(180deg, #f0f4ff 0%, #e4eaff 100%)', borderBottom: '1px solid rgba(100,140,220,0.3)', fontSize: 11, color: '#334', fontWeight: 'bold', flexShrink: 0 }}>
        🎶 Recently Played · {tracks.length} tracks
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tracks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: '#99a' }}>
            <div style={{ fontSize: 48 }}>🎵</div>
            <div style={{ fontSize: 12 }}>No tracks played yet</div>
            <div style={{ fontSize: 10, color: '#bbc' }}>Play something on Spotify to start your history</div>
          </div>
        ) : tracks.map((t, i) => (
          <div
            key={`${t.title}-${t.playedAt}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              borderBottom: '1px solid rgba(180,200,240,0.3)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(240,244,255,0.5)',
            }}
          >
            {/* Rank */}
            <div style={{ width: 20, textAlign: 'center', fontSize: 11, color: '#99a', flexShrink: 0 }}>
              {i + 1}
            </div>

            {/* Album art */}
            {t.albumArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.albumArt} alt="" style={{ width: 40, height: 40, borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: 3, background: '#e8eeff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎵</div>
            )}

            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 'bold', color: '#112', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
              <div style={{ fontSize: 10, color: '#667', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.artist}</div>
            </div>

            {/* Time */}
            <div style={{ fontSize: 10, color: '#99a', flexShrink: 0 }}>{timeAgo(t.playedAt)}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {tracks.length > 0 && (
        <div style={{ padding: '6px 12px', background: 'linear-gradient(180deg, #e4eaff 0%, #dde4f8 100%)', borderTop: '1px solid rgba(100,140,220,0.3)', fontSize: 10, color: '#778', flexShrink: 0 }}>
          Showing last {tracks.length} tracks · Updates automatically
        </div>
      )}
    </div>
  );
}
