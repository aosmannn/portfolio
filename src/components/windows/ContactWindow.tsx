'use client';

import { useState } from 'react';

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError('Failed to send. Try again.');
      }
    } catch {
      setError('Failed to send. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="win-content">
      <div className="win-section-title">Contact Me</div>

      {sent && (
        <div style={{
          background: '#dff0d8',
          border: '1px solid #5cb85c',
          borderRadius: 3,
          padding: '8px 12px',
          marginBottom: 12,
          color: '#2d6a2d',
          fontSize: 12,
          fontFamily: 'Tahoma, sans-serif',
        }}>
          ✓ Message sent! I&apos;ll get back to you soon.
        </div>
      )}

      {error && (
        <div style={{
          background: '#fdd',
          border: '1px solid #c00',
          borderRadius: 3,
          padding: '8px 12px',
          marginBottom: 12,
          color: '#900',
          fontSize: 12,
          fontFamily: 'Tahoma, sans-serif',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <div>
          <div className="xp-label">Name</div>
          <input
            className="xp-input"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Your name"
          />
        </div>
        <div>
          <div className="xp-label">Email</div>
          <input
            className="xp-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="your@email.com"
          />
        </div>
        <div>
          <div className="xp-label">Message</div>
          <textarea
            className="xp-textarea"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            placeholder="What's on your mind?"
          />
        </div>
        <button
          type="submit"
          className="xp-push-btn"
          style={{ alignSelf: 'flex-start' }}
          disabled={sending}
        >
          {sending ? 'Sending…' : 'Send Message'}
        </button>
      </form>

      <div className="xp-separator" />

      <div className="win-section-title">Find Me Online</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a
          href="https://github.com/aosmannn"
          target="_blank"
          rel="noopener noreferrer"
          className="aero-btn"
          style={{ textDecoration: 'none' }}
        >
          🐙 GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/adamogsu"
          target="_blank"
          rel="noopener noreferrer"
          className="aero-btn"
          style={{ textDecoration: 'none' }}
        >
          💼 LinkedIn
        </a>
        <a
          href="mailto:adamosmn06@gmail.com"
          className="aero-btn"
          style={{ textDecoration: 'none' }}
        >
          ✉️ Email
        </a>
      </div>
    </div>
  );
}
