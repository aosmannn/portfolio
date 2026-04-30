'use client';

import { useEffect, useRef, useState } from 'react';
import { showToast } from '@/lib/toast';
import { addTrack } from '@/lib/playlistHistory';
import { triggerClippyMessage } from '@/components/Clippy';

interface NowPlayingData {
  isPlaying: boolean;
  notConfigured?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
  progress?: number;
  duration?: number;
}

interface LyricLine { time: number; text: string; }

// sentinel values for lyrics state
const LYRICS_LOADING: LyricLine[] = [];
const LYRICS_NONE = [{ time: -999, text: '__none__' }];

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function parseLRC(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of lrc.split('\n')) {
    const match = line.match(/\[(\d+):(\d+)[.:]([\d]+)\](.*)/);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3].padEnd(3, '0').slice(0, 3));
      const text = match[4].trim();
      if (text) lines.push({ time: (min * 60 + sec) * 1000 + ms, text });
    }
  }
  return lines;
}

export default function MusicPlayer() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [lyrics, setLyrics] = useState<LyricLine[]>(LYRICS_LOADING);
  const [lyricIdx, setLyricIdx] = useState(-1);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [showLyrics, setShowLyrics] = useState(true);
  const [useVinyl, setUseVinyl] = useState(true);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTrackRef = useRef<string>('');
  const lyricContainerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<NowPlayingData | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/spotify/now-playing', { cache: 'no-store' });
      if (!res.ok) return;
      const json: NowPlayingData = await res.json();
      const trackId = `${json.title ?? ''}-${json.artist ?? ''}`;

      // Detect track change — update immediately
      if (json.isPlaying && json.title && trackId !== lastTrackRef.current) {
        lastTrackRef.current = trackId;
        showToast({
          title: '🎵 Now Playing',
          body: `${json.title} — ${json.artist ?? 'Unknown'} · Open Music Player for lyrics`,
          icon: json.albumArt,
        });
        addTrack({ title: json.title, artist: json.artist ?? 'Unknown', albumArt: json.albumArt });
        triggerClippyMessage(`🎵 Now playing: "${json.title}" by ${json.artist ?? 'Unknown'}. Open the Music Player on the taskbar to follow along with lyrics!`);
        // Clear lyrics immediately on skip
        setLyrics(LYRICS_LOADING);
        setLyricIdx(-1);
        setLyricsLoading(true);
        // Fetch lyrics for the new track
        fetchLyrics(json);
      }

      dataRef.current = json;
      setData(json);
      setLocalProgress(json.progress ?? 0);
      if (json.isPlaying && json.title) {
        // expose to Clippy
        (window as unknown as Record<string, unknown>).__nowPlaying = { title: json.title, artist: json.artist, album: json.album };
      } else {
        (window as unknown as Record<string, unknown>).__nowPlaying = null;
      }
    } catch {
      // silently ignore
    }
  };

  const fetchLyrics = async (track: NowPlayingData) => {
    if (!track.title || !track.artist) { setLyrics(LYRICS_NONE); setLyricsLoading(false); return; }
    try {
      const params = new URLSearchParams({
        track_name: track.title,
        artist_name: track.artist,
        ...(track.album ? { album_name: track.album } : {}),
        ...(track.duration ? { duration: String(Math.round(track.duration / 1000)) } : {}),
      });
      const res = await fetch(`/api/lyrics?${params}`);
      if (!res.ok) { setLyrics(LYRICS_NONE); setLyricsLoading(false); return; }
      const json = await res.json();
      if (json.syncedLyrics) {
        const parsed = parseLRC(json.syncedLyrics);
        setLyrics(parsed.length > 0 ? parsed : LYRICS_NONE);
      } else if (json.plainLyrics) {
        const lines = json.plainLyrics.split('\n').filter(Boolean).map((t: string) => ({ time: -1, text: t }));
        setLyrics(lines.length > 0 ? lines : LYRICS_NONE);
      } else {
        setLyrics(LYRICS_NONE);
      }
    } catch {
      setLyrics(LYRICS_NONE);
    }
    setLyricsLoading(false);
  };

  // Poll every 3 seconds for near-real-time skip detection
  useEffect(() => {
    fetchNowPlaying();
    const pollInterval = setInterval(fetchNowPlaying, 3000);
    return () => clearInterval(pollInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On first load, fetch lyrics for current track
  useEffect(() => {
    if (data?.isPlaying && data.title && lastTrackRef.current === '' ) {
      lastTrackRef.current = `${data.title}-${data.artist ?? ''}`;
      setLyricsLoading(true);
      fetchLyrics(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.title]);

  // Local progress tick every second
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (data?.isPlaying) {
      tickRef.current = setInterval(() => {
        setLocalProgress((p) => {
          const dur = dataRef.current?.duration ?? 0;
          if (dur > 0 && p + 1000 >= dur) return dur;
          return p + 1000;
        });
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [data?.isPlaying, data?.duration]);

  // Update active lyric index
  useEffect(() => {
    const isNone = lyrics === LYRICS_NONE || (lyrics.length === 1 && lyrics[0].time === -999);
    if (!lyrics.length || isNone) return;
    const dur = data?.duration ?? 0;
    if (lyrics[0].time === -1) {
      if (dur > 0) {
        const pct = localProgress / dur;
        const idx = Math.min(Math.floor(pct * lyrics.length), lyrics.length - 1);
        setLyricIdx(idx);
      }
      return;
    }
    const active = lyrics.reduce((best, line, i) => line.time <= localProgress ? i : best, -1);
    setLyricIdx(active);
  }, [localProgress, lyrics, data?.duration]);

  // Scroll active lyric into view
  useEffect(() => {
    if (lyricIdx < 0 || !lyricContainerRef.current) return;
    const el = lyricContainerRef.current.children[lyricIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [lyricIdx]);

  const duration = data?.duration ?? 0;
  const progressPercent = duration > 0 ? (localProgress / duration) * 100 : 0;
  const isNoneLyrics = lyrics === LYRICS_NONE || (lyrics.length === 1 && lyrics[0]?.time === -999);
  const hasLyrics = !isNoneLyrics && lyrics.length > 0;

  if (!data || data.notConfigured) {
    return (
      <div className="media-player" style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ fontSize: 28 }}>🎵</div>
        <div style={{ color: '#406080', fontSize: 10, textAlign: 'center' }}>Spotify not configured</div>
      </div>
    );
  }

  if (!data.isPlaying) {
    return (
      <div className="media-player" style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.973c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 01.256 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 01-1.006 1.588l.052.02z"/>
        </svg>
        <div style={{ color: '#406080', fontSize: 10, textAlign: 'center' }}>Nothing playing</div>
      </div>
    );
  }

  return (
    <div className="media-player" style={{ overflow: 'hidden' }}>
      {/* Toggle controls */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0, justifyContent: 'flex-end' }}>
        <button
          onClick={() => setUseVinyl(v => !v)}
          title={useVinyl ? 'Switch to album art' : 'Switch to vinyl'}
          style={{
            fontSize: 9, padding: '2px 6px', cursor: 'pointer', borderRadius: 3,
            background: useVinyl ? 'rgba(0,170,255,0.25)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${useVinyl ? '#00aaff' : 'rgba(100,160,200,0.3)'}`,
            color: useVinyl ? '#00aaff' : '#4090a0',
            fontFamily: 'Tahoma, sans-serif', transition: 'all 0.15s',
          }}
        >
          {useVinyl ? '💿 Vinyl' : '🖼 Album'}
        </button>
        <button
          onClick={() => setShowLyrics(l => !l)}
          title={showLyrics ? 'Hide lyrics' : 'Show lyrics'}
          style={{
            fontSize: 9, padding: '2px 6px', cursor: 'pointer', borderRadius: 3,
            background: showLyrics ? 'rgba(0,170,255,0.25)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${showLyrics ? '#00aaff' : 'rgba(100,160,200,0.3)'}`,
            color: showLyrics ? '#00aaff' : '#4090a0',
            fontFamily: 'Tahoma, sans-serif', transition: 'all 0.15s',
          }}
        >
          {showLyrics ? '🎤 Lyrics On' : '🎤 Lyrics Off'}
        </button>
      </div>

      {/* Track info row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexShrink: 0 }}>
        {/* Album art or vinyl */}
        {useVinyl ? (
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0, position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #1a1a1a 28%, #111 29%, #222 31%, #111 33%, #222 35%, #111 37%, #222 39%, #111 41%, #222 43%, #111 45%, #1a1a1a 46%, #1a1a1a 100%)',
            boxShadow: '0 0 12px rgba(0,170,255,0.4), inset 0 0 8px rgba(0,0,0,0.8)',
            border: '1px solid #333',
            animation: 'vinylSpin 2.4s linear infinite',
            animationPlayState: data.isPlaying ? 'running' : 'paused',
          }}>
            <style>{`@keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 28, height: 28, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid #444', boxShadow: '0 0 4px rgba(0,0,0,0.8)',
            }}>
              {data.albumArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.albumArt} alt="album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎵</div>
              )}
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 4, height: 4, borderRadius: '50%', background: '#000', border: '1px solid #555' }} />
          </div>
        ) : (
          data.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.albumArt} alt="album" style={{ width: 64, height: 64, borderRadius: 3, border: '1px solid #204080', flexShrink: 0, boxShadow: '0 0 8px rgba(0,170,255,0.3)' }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: 3, border: '1px solid #204080', background: '#101030', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎵</div>
          )
        )}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ color: '#80e0ff', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.title ?? 'Unknown'}</div>
          <div style={{ color: '#4090a0', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.artist ?? 'Unknown'}</div>
          <div className="now-playing-bars" style={{ marginTop: 2 }}>
            <div className="bar bar-1" style={{ animationPlayState: 'running' }} />
            <div className="bar bar-2" style={{ animationPlayState: 'running' }} />
            <div className="bar bar-3" style={{ animationPlayState: 'running' }} />
          </div>
        </div>
      </div>

      {/* Lyrics area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0, display: showLyrics ? undefined : 'none' }}>
        {lyricsLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(100,160,200,0.5)', fontSize: 10, fontStyle: 'italic' }}>
            Loading lyrics...
          </div>
        ) : isNoneLyrics ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
            <div style={{ fontSize: 20, opacity: 0.4 }}>🎤</div>
            <div style={{ color: 'rgba(100,150,180,0.6)', fontSize: 10, fontStyle: 'italic' }}>No lyrics for this song</div>
          </div>
        ) : hasLyrics ? (
          <>
            <div ref={lyricContainerRef} style={{ height: '100%', overflowY: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
              {lyrics.map((line, i) => {
                const isActive = i === lyricIdx;
                const isPast = i < lyricIdx;
                return (
                  <div key={i} style={{
                    textAlign: 'center',
                    padding: '4px 10px',
                    fontSize: isActive ? 12 : 10,
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#ffffff' : isPast ? 'rgba(120,180,220,0.4)' : 'rgba(140,190,230,0.55)',
                    background: isActive ? 'linear-gradient(90deg, transparent, rgba(0,170,255,0.2), transparent)' : 'transparent',
                    borderLeft: isActive ? '3px solid #00aaff' : '3px solid transparent',
                    transition: 'all 0.25s ease',
                    lineHeight: 1.6,
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    textShadow: isActive ? '0 0 14px rgba(0,200,255,0.7)' : 'none',
                    borderRadius: 3,
                  }}>
                    {line.text}
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(180deg, rgba(8,16,40,0.95) 0%, transparent 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(0deg, rgba(8,16,40,0.95) 0%, transparent 100%)', pointerEvents: 'none' }} />
          </>
        ) : null}
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
        <div style={{ position: 'relative', height: 6, background: '#102040', borderRadius: 3, border: '1px solid #204080' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #00aaff, #00ffcc)', borderRadius: 3, transition: 'width 0.5s linear' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#406080', fontSize: 9 }}>
          <span>{formatMs(localProgress)}</span>
          <span>{formatMs(duration)}</span>
        </div>
      </div>

      {/* Spotify link */}
      {data.songUrl && (
        <a href={data.songUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#1DB954', color: '#000', borderRadius: 3, padding: '4px 8px', fontSize: 10, fontWeight: 'bold', textDecoration: 'none', transition: 'opacity 0.1s', flexShrink: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.973c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 01.256 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 01-1.006 1.588l.052.02z"/></svg>
          Open in Spotify
        </a>
      )}
    </div>
  );
}
