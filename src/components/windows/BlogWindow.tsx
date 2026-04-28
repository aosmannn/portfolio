'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string;
}

export default function BlogWindow() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Post | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/blog/posts')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return (
      <div className="win-content" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Back bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 8px',
          background: 'linear-gradient(180deg, #ddeeff 0%, #c8dff8 100%)',
          borderBottom: '1px solid #b0c8e8',
          marginBottom: 12,
        }}>
          <button
            className="xp-push-btn"
            onClick={() => setSelected(null)}
            style={{ fontSize: 11, padding: '2px 12px' }}
          >
            ← Back
          </button>
          <span style={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>Blog</span>
        </div>

        {/* Post content */}
        <div style={{ padding: '0 4px', flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#003380', marginBottom: 4 }}>
            {selected.title}
          </div>
          <div style={{ fontSize: 10, color: '#888', marginBottom: 12 }}>
            {new Date(selected.published_at).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
          <div className="xp-separator" />
          <div style={{
            fontSize: 12,
            color: '#111',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            marginTop: 10,
          }}>
            {selected.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="win-content" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        background: 'linear-gradient(180deg, #ddeeff 0%, #c8dff8 100%)',
        borderBottom: '1px solid #b0c8e8',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 'bold', color: '#003380', fontFamily: 'Tahoma, sans-serif' }}>
          📝 My Blog
        </span>
        <span style={{ fontSize: 10, color: '#555', marginLeft: 'auto' }}>
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 12 }}>
          Loading posts...
        </div>
      ) : error ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#cc0000', fontSize: 12 }}>
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 12 }}>
          No posts yet. Visit <strong>/admin</strong> to write your first post.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map((post, i) => (
            <button
              key={post.id}
              onClick={() => setSelected(post)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: i % 2 === 0 ? '#f0f4ff' : '#e8efff',
                border: 'none',
                borderBottom: '1px solid #ccd8f0',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Tahoma, sans-serif',
                transition: 'background 0.1s',
                width: '100%',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c8d8ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#f0f4ff' : '#e8efff')}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#003380', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 1 }}>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#5080c0', flexShrink: 0, marginLeft: 8 }}>▶</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
