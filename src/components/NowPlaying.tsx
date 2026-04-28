"use client";

import { useEffect, useState } from "react";

interface NowPlayingData {
  isPlaying: boolean;
  notConfigured?: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  songUrl?: string;
  progress?: number;
  duration?: number;
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data || !data.isPlaying || data.notConfigured) return null;

  return (
    <a
      href={data.songUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="now-playing"
      title={`${data.title} — ${data.artist}`}
    >
      {data.albumArt && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.albumArt}
          alt="album art"
          className="now-playing-art"
        />
      )}
      <div className="now-playing-info">
        <div className="now-playing-title">{data.title}</div>
        <div className="now-playing-artist">{data.artist}</div>
      </div>
      <div className="now-playing-bars">
        <div className="bar bar-1" />
        <div className="bar bar-2" />
        <div className="bar bar-3" />
      </div>
    </a>
  );
}
