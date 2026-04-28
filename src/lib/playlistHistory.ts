const MAX = 15;
const KEY = 'playlist-history-v1';

export interface HistoryTrack {
  title: string;
  artist: string;
  albumArt?: string;
  playedAt: number;
}

export function addTrack(track: Omit<HistoryTrack, 'playedAt'>) {
  const existing = getHistory();
  const filtered = existing.filter(t => !(t.title === track.title && t.artist === track.artist));
  const updated = [{ ...track, playedAt: Date.now() }, ...filtered].slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
}

export function getHistory(): HistoryTrack[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
