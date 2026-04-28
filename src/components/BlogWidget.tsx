'use client';

import { useState, useEffect, useRef } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  content: string;
}

export default function BlogWidget({ onOpen }: { onOpen: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pos, setPos] = useState(() => ({
    x: 200,
    y: 8,
  }));
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/api/blog/posts')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPosts(data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - 260)),
        y: Math.max(0, Math.min(e.clientY - offset.current.y, window.innerHeight - 48)),
      });
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  if (posts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      left: pos.x,
      top: pos.y,
      width: 260,
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: 8,
      boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(40,100,200,0.2)',
      zIndex: 50,
      overflow: 'hidden',
      fontFamily: 'Tahoma, sans-serif',
    }}>
      {/* Draggable header */}
      <div
        onMouseDown={startDrag}
        style={{
          background: 'rgba(30,80,180,0.55)',
          backdropFilter: 'blur(10px)',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          cursor: 'move',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 'bold', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          📝 Latest Posts
        </span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onOpen}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 3,
            color: 'white',
            fontSize: 10,
            padding: '2px 8px',
            cursor: 'pointer',
            fontFamily: 'Tahoma, sans-serif',
          }}
        >
          View All
        </button>
      </div>

      {/* Posts */}
      {posts.map((post, i) => (
        <button
          key={post.id}
          onClick={onOpen}
          style={{
            display: 'block',
            width: '100%',
            padding: '7px 10px',
            background: i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
            border: 'none',
            borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'; }}
        >
          <div style={{ fontSize: 11, fontWeight: 'bold', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(200,220,255,0.75)', marginTop: 1 }}>
            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </button>
      ))}
    </div>
  );
}
