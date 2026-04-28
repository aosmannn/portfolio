'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [authError, setAuthError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/blog/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (authed) fetchPosts();
  }, [authed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingAuth(true);
    setAuthError('');
    try {
      const res = await fetch('/api/blog/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
      } else {
        setAuthError('Incorrect password.');
      }
    } catch {
      setAuthError('Connection error. Try again.');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage('Title and content are required.');
      return;
    }
    setPublishing(true);
    setMessage('');
    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, password }),
      });
      if (res.ok) {
        setMessage('Post published successfully!');
        setTitle('');
        setContent('');
        fetchPosts();
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error || 'Failed to publish'}`);
      }
    } catch {
      setMessage('Connection error. Try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try {
      const res = await fetch('/api/blog/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setMessage('Failed to delete post.');
      }
    } catch {
      setMessage('Connection error.');
    }
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #003b8e 0%, #000066 50%, #000033 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Tahoma, sans-serif',
      }}>
        <div className="xp-window" style={{ width: 340, position: 'relative' }}>
          <div className="xp-titlebar">
            <span className="xp-title-icon">📝</span>
            <span className="xp-title-text">Blog Admin — Login</span>
          </div>
          <div className="xp-body" style={{ padding: 24 }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div className="xp-label" style={{ marginBottom: 6 }}>Administrator Password</div>
                <input
                  className="xp-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  autoFocus
                  style={{ marginBottom: 0 }}
                />
              </div>
              {authError && (
                <div style={{ color: '#cc0000', fontSize: 11, fontFamily: 'Tahoma, sans-serif' }}>
                  {authError}
                </div>
              )}
              <button
                type="submit"
                className="aero-btn"
                disabled={checkingAuth}
                style={{ alignSelf: 'flex-end' }}
              >
                {checkingAuth ? 'Checking...' : 'Enter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #003b8e 0%, #000066 50%, #000033 100%)',
      fontFamily: 'Tahoma, sans-serif',
      padding: 24,
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* New Post */}
        <div className="xp-window" style={{ position: 'relative' }}>
          <div className="xp-titlebar">
            <span className="xp-title-icon">✏️</span>
            <span className="xp-title-text">New Post</span>
          </div>
          <div className="xp-body" style={{ padding: 16 }}>
            <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div className="xp-label">Title</div>
                <input
                  className="xp-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title..."
                />
              </div>
              <div>
                <div className="xp-label">Content (Markdown supported)</div>
                <textarea
                  className="xp-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post here..."
                  rows={12}
                />
              </div>
              {message && (
                <div style={{
                  color: message.startsWith('Error') ? '#cc0000' : '#006600',
                  fontSize: 11,
                  fontFamily: 'Tahoma, sans-serif',
                  padding: '4px 8px',
                  background: message.startsWith('Error') ? '#fff0f0' : '#f0fff0',
                  border: `1px solid ${message.startsWith('Error') ? '#ffaaaa' : '#aaffaa'}`,
                  borderRadius: 2,
                }}>
                  {message}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="aero-btn" disabled={publishing}>
                  {publishing ? 'Publishing...' : '📝 Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Post List */}
        <div className="xp-window" style={{ position: 'relative' }}>
          <div className="xp-titlebar">
            <span className="xp-title-icon">📋</span>
            <span className="xp-title-text">Existing Posts ({posts.length})</span>
          </div>
          <div className="xp-body" style={{ padding: 12 }}>
            {loadingPosts ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#666', fontSize: 12 }}>Loading posts...</div>
            ) : posts.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#666', fontSize: 12 }}>No posts yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {posts.map((post) => (
                  <div key={post.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    background: 'linear-gradient(180deg, #f8faff 0%, #eef4ff 100%)',
                    border: '1px solid #b0c8e8',
                    borderRadius: 3,
                    gap: 8,
                  }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#003380', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#666' }}>
                        {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="xp-push-btn"
                      style={{ fontSize: 10, padding: '2px 10px', color: '#800000', flexShrink: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Win7-style delete dialog */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="xp-window" style={{ width: 340, position: 'relative' }}>
            <div className="xp-titlebar">
              <span className="xp-title-icon">⚠️</span>
              <span className="xp-title-text">Confirm Delete</span>
              <div className="xp-controls">
                <button className="xp-btn xp-close" onClick={() => setDeleteConfirm(null)}>✕</button>
              </div>
            </div>
            <div className="xp-body" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>🗑️</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: '#001060', marginBottom: 6 }}>
                    Delete this post?
                  </div>
                  <div style={{ fontSize: 11, color: '#444', lineHeight: 1.5 }}>
                    This action cannot be undone. The post will be permanently removed.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="xp-push-btn" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button
                  className="xp-push-btn"
                  onClick={confirmDelete}
                  style={{ color: '#800000', fontWeight: 'bold' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
