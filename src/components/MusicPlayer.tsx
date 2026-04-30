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
interface VinylProps { albumArt?: string; isPlaying: boolean; size: number; labelSize: number; }
interface AlbumProps { albumArt?: string; size: number; radius: number; }

const LYRICS_LOADING: LyricLine[] = [];
const LYRICS_NONE = [{ time: -999, text: '__none__' }];

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function parseLRC(lrc: string): LyricLine[] {
  return lrc.split('\n').flatMap(line => {
    const m = line.match(/\[(\d+):(\d+)[.:]([\d]+)\](.*)/);
    if (!m) return [];
    const text = m[4].trim();
    if (!text) return [];
    return [{ time: (parseInt(m[1]) * 60 + parseInt(m[2])) * 1000 + parseInt(m[3].padEnd(3,'0').slice(0,3)), text }];
  });
}

// Defined OUTSIDE MusicPlayer so React never remounts it on re-render
function VinylDisc({ albumArt, isPlaying, size, labelSize }: VinylProps) {
  return (
    <div
      className={isPlaying ? 'vinyl-disc' : 'vinyl-disc vinyl-paused'}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative',
        background: 'radial-gradient(circle, #1c1c1c 0%, #1c1c1c 27%, #0d0d0d 28%, #252525 30%, #0d0d0d 32%, #252525 34%, #0d0d0d 36%, #252525 38%, #0d0d0d 40%, #252525 42%, #0d0d0d 44%, #1c1c1c 45%, #1c1c1c 100%)',
        boxShadow: `0 0 ${size / 8}px rgba(0,170,255,0.35), inset 0 0 ${size / 10}px rgba(0,0,0,0.9)`,
        border: '1px solid #2a2a2a',
      }}
    >
      {/* Center label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: labelSize, height: labelSize, borderRadius: '50%',
        overflow: 'hidden', border: '2px solid #3a3a3a',
        boxShadow: '0 0 8px rgba(0,0,0,1)',
      }}>
        {albumArt
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={albumArt} alt="album" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: labelSize / 3 }}>🎵</div>}
      </div>
      {/* Spindle */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 5, height: 5, borderRadius: '50%', background: '#111', border: '1px solid #444', zIndex: 1 }} />
    </div>
  );
}

function AlbumArt({ albumArt, size, radius }: AlbumProps) {
  if (!albumArt) return <div style={{ width: size, height: size, borderRadius: radius, background: '#101828', border: '1px solid #1e3050', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size / 2.5 }}>🎵</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={albumArt} alt="album" style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, objectFit: 'cover', border: '1px solid rgba(0,120,215,0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.6)' }} />;
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
  const lastTrackRef = useRef('');
  const lyricContainerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<NowPlayingData | null>(null);

  const fetchLyrics = async (track: NowPlayingData) => {
    if (!track.title || !track.artist) { setLyrics(LYRICS_NONE); setLyricsLoading(false); return; }
    try {
      const p = new URLSearchParams({ track_name: track.title, artist_name: track.artist, ...(track.album ? { album_name: track.album } : {}), ...(track.duration ? { duration: String(Math.round(track.duration / 1000)) } : {}) });
      const res = await fetch(`/api/lyrics?${p}`);
      if (!res.ok) { setLyrics(LYRICS_NONE); setLyricsLoading(false); return; }
      const json = await res.json();
      if (json.syncedLyrics) {
        const parsed = parseLRC(json.syncedLyrics);
        setLyrics(parsed.length > 0 ? parsed : LYRICS_NONE);
      } else if (json.plainLyrics) {
        const lines = json.plainLyrics.split('\n').filter(Boolean).map((t: string) => ({ time: -1, text: t }));
        setLyrics(lines.length > 0 ? lines : LYRICS_NONE);
      } else { setLyrics(LYRICS_NONE); }
    } catch { setLyrics(LYRICS_NONE); }
    setLyricsLoading(false);
  };

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch('/api/spotify/now-playing', { cache: 'no-store' });
      if (!res.ok) return;
      const json: NowPlayingData = await res.json();
      const trackId = `${json.title ?? ''}-${json.artist ?? ''}`;
      if (json.isPlaying && json.title && trackId !== lastTrackRef.current) {
        lastTrackRef.current = trackId;
        showToast({ title: '🎵 Now Playing', body: `${json.title} — ${json.artist ?? 'Unknown'} · Open Music Player for lyrics`, icon: json.albumArt });
        addTrack({ title: json.title, artist: json.artist ?? 'Unknown', albumArt: json.albumArt });
        triggerClippyMessage(`🎵 Now playing: "${json.title}" by ${json.artist ?? 'Unknown'}. Open the Music Player on the taskbar to follow along with lyrics!`);
        setLyrics(LYRICS_LOADING); setLyricIdx(-1); setLyricsLoading(true);
        fetchLyrics(json);
      }
      dataRef.current = json;
      setData(json);
      setLocalProgress(json.progress ?? 0);
      (window as unknown as Record<string, unknown>).__nowPlaying = json.isPlaying && json.title
        ? { title: json.title, artist: json.artist, album: json.album } : null;
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchNowPlaying();
    const id = setInterval(fetchNowPlaying, 3000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.isPlaying && data.title && lastTrackRef.current === '') {
      lastTrackRef.current = `${data.title}-${data.artist ?? ''}`;
      setLyricsLoading(true); fetchLyrics(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.title]);

  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (data?.isPlaying) {
      tickRef.current = setInterval(() => {
        setLocalProgress(p => { const dur = dataRef.current?.duration ?? 0; return dur > 0 && p + 1000 >= dur ? dur : p + 1000; });
      }, 1000);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [data?.isPlaying, data?.duration]);

  useEffect(() => {
    const isNone = lyrics === LYRICS_NONE || (lyrics.length === 1 && lyrics[0].time === -999);
    if (!lyrics.length || isNone) return;
    const dur = data?.duration ?? 0;
    if (lyrics[0].time === -1) { if (dur > 0) setLyricIdx(Math.min(Math.floor((localProgress / dur) * lyrics.length), lyrics.length - 1)); return; }
    setLyricIdx(lyrics.reduce((best, line, i) => line.time <= localProgress ? i : best, -1));
  }, [localProgress, lyrics, data?.duration]);

  useEffect(() => {
    if (lyricIdx < 0 || !lyricContainerRef.current) return;
    (lyricContainerRef.current.children[lyricIdx] as HTMLElement | undefined)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [lyricIdx]);

  const duration = data?.duration ?? 0;
  const progressPercent = duration > 0 ? (localProgress / duration) * 100 : 0;
  const isNoneLyrics = lyrics === LYRICS_NONE || (lyrics.length === 1 && lyrics[0]?.time === -999);
  const hasLyrics = !isNoneLyrics && lyrics.length > 0;

  if (!data || data.notConfigured) return (
    <div className="media-player" style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ fontSize: 28 }}>🎵</div>
      <div style={{ color: '#406080', fontSize: 10, textAlign: 'center' }}>Spotify not configured</div>
    </div>
  );

  if (!data.isPlaying) return (
    <div className="media-player" style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.973c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 01.256 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 01-1.006 1.588l.052.02z"/></svg>
      <div style={{ color: '#406080', fontSize: 10 }}>Nothing playing</div>
    </div>
  );

  const vinylSize = showLyrics ? 60 : 150;
  const labelSize = showLyrics ? 26 : 82;

  const Toggles = () => (
    <div style={{ display: 'flex', gap: 4, flexShrink: 0, justifyContent: 'flex-end' }}>
      <button onClick={() => setUseVinyl(v => !v)} style={{ fontSize: 9, padding: '2px 7px', cursor: 'pointer', borderRadius: 10, background: useVinyl ? 'rgba(0,170,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${useVinyl ? 'rgba(0,170,255,0.5)' : 'rgba(100,160,200,0.2)'}`, color: useVinyl ? '#60c8ff' : '#4080a0', fontFamily: 'Tahoma, sans-serif', transition: 'all 0.15s' }}>
        {useVinyl ? '💿 Vinyl' : '🖼 Album'}
      </button>
      <button onClick={() => setShowLyrics(l => !l)} style={{ fontSize: 9, padding: '2px 7px', cursor: 'pointer', borderRadius: 10, background: showLyrics ? 'rgba(0,170,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showLyrics ? 'rgba(0,170,255,0.5)' : 'rgba(100,160,200,0.2)'}`, color: showLyrics ? '#60c8ff' : '#4080a0', fontFamily: 'Tahoma, sans-serif', transition: 'all 0.15s' }}>
        🎤 Lyrics {showLyrics ? 'On' : 'Off'}
      </button>
    </div>
  );

  const ProgressBar = () => (
    <div style={{ flexShrink: 0 }}>
      <div style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 3 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #0af, #0fc)', borderRadius: 2, transition: 'width 0.8s linear' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(100,160,200,0.5)', fontSize: 9 }}>
        <span>{formatMs(localProgress)}</span>
        <span>{formatMs(duration)}</span>
      </div>
    </div>
  );

  const SpotifyBtn = () => data.songUrl ? (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#1DB954', color: '#000', borderRadius: 4, padding: '5px 8px', fontSize: 10, fontWeight: 'bold', textDecoration: 'none', flexShrink: 0 }}
      onMouseEnter={e => (e.currentTarget.style.opacity='0.85')} onMouseLeave={e => (e.currentTarget.style.opacity='1')}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 11-.277-1.215c3.809-.87 7.076-.496 9.712 1.115a.623.623 0 01.207.857zm1.223-2.722a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.52-.973c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 01.256 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 01-1.006 1.588l.052.02z"/></svg>
      Open in Spotify
    </a>
  ) : null;

  return (
    <div className="media-player" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Blurred album art background */}
      {data.albumArt && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.albumArt} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.18) saturate(1.5)', transform: 'scale(1.1)' }} />
        </div>
      )}
      {/* Content above background */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 6, overflow: 'hidden' }}>
        <Toggles />

        {showLyrics ? (
          <>
            {/* Lyrics mode — small art + info */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
              {useVinyl
                ? <VinylDisc albumArt={data.albumArt} isPlaying={data.isPlaying} size={vinylSize} labelSize={labelSize} />
                : <AlbumArt albumArt={data.albumArt} size={vinylSize} radius={4} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#e8f4ff', fontSize: 12, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{data.title ?? 'Unknown'}</div>
                <div style={{ color: 'rgba(160,210,240,0.7)', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{data.artist ?? 'Unknown'}</div>
                <div className="now-playing-bars" style={{ marginTop: 5 }}>
                  <div className="bar bar-1" /><div className="bar bar-2" /><div className="bar bar-3" />
                </div>
              </div>
            </div>
            {/* Lyrics */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
              {lyricsLoading ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(120,180,220,0.4)', fontSize: 10, fontStyle: 'italic' }}>Loading lyrics...</div>
              ) : isNoneLyrics ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <div style={{ fontSize: 18, opacity: 0.3 }}>🎤</div>
                  <div style={{ color: 'rgba(120,160,190,0.5)', fontSize: 10, fontStyle: 'italic' }}>No lyrics for this song</div>
                </div>
              ) : hasLyrics ? (
                <>
                  <div ref={lyricContainerRef} style={{ height: '100%', overflowY: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
                    {lyrics.map((line, i) => {
                      const isActive = i === lyricIdx, isPast = i < lyricIdx;
                      return (
                        <div key={i} style={{ textAlign: 'center', padding: '4px 8px', fontSize: isActive ? 12 : 10, fontWeight: isActive ? '700' : '400', color: isActive ? '#fff' : isPast ? 'rgba(130,180,220,0.35)' : 'rgba(160,200,230,0.5)', background: isActive ? 'linear-gradient(90deg,transparent,rgba(0,160,255,0.18),transparent)' : 'transparent', borderLeft: isActive ? '2px solid #00aaff' : '2px solid transparent', transition: 'all 0.2s ease', lineHeight: 1.65, transform: isActive ? 'scale(1.03)' : 'scale(1)', textShadow: isActive ? '0 0 12px rgba(0,200,255,0.6)' : 'none', borderRadius: 3 }}>
                          {line.text}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 16, background: 'linear-gradient(180deg,rgba(5,12,30,0.9)0%,transparent 100%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 16, background: 'linear-gradient(0deg,rgba(5,12,30,0.9)0%,transparent 100%)', pointerEvents: 'none' }} />
                </>
              ) : null}
            </div>
          </>
        ) : (
          /* No-lyrics mode — big centered art */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 0 }}>
            {useVinyl
              ? <VinylDisc albumArt={data.albumArt} isPlaying={data.isPlaying} size={vinylSize} labelSize={labelSize} />
              : <AlbumArt albumArt={data.albumArt} size={vinylSize} radius={10} />}
            <div style={{ textAlign: 'center', width: '100%', padding: '0 12px' }}>
              <div style={{ color: '#eef6ff', fontSize: 14, fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{data.title ?? 'Unknown'}</div>
              <div style={{ color: 'rgba(160,210,240,0.65)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 3 }}>{data.artist ?? 'Unknown'}</div>
              <div className="now-playing-bars" style={{ marginTop: 8, justifyContent: 'center' }}>
                <div className="bar bar-1" /><div className="bar bar-2" /><div className="bar bar-3" />
              </div>
            </div>
          </div>
        )}

        <ProgressBar />
        <SpotifyBtn />
      </div>
    </div>
  );
}
