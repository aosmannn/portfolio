'use client';

import { useEffect, useState, useRef } from 'react';

type ShowFn = (msg: string, persist?: boolean) => void;
let _clippyShow: ShowFn | null = null;
export function triggerClippyMessage(msg: string, persist = false) {
  _clippyShow?.(msg, persist);
}

let _virusCallback: (() => void) | null = null;
export function setVirusCallback(fn: () => void) { _virusCallback = fn; }

const MESSAGES = [
  "It looks like you're viewing a portfolio. Want me to annoy you about it?",
  "Have you considered hiring Adam? Just a thought. I'm not biased.",
  "It looks like you're reading about me. Need help writing a job offer?",
  "Tip: Double-clicking an icon opens a window. You're welcome.",
  "Did you know Adam built this entire Windows 7 UI from scratch? Wild right?",
  "It looks like you're procrastinating. Can I help you procrastinate better?",
  "ERROR: Too much talent detected in this portfolio. Please contact HR.",
  "Fun fact: This screensaver is actually a portfolio. Tricked ya.",
  "It looks like you're looking at the Recycle Bin. Interesting life choices.",
  "Adam is available for hire. This message was not approved by Adam.",
  "Right-click the desktop. Go ahead. I won't tell you what happens.",
  "I heard you like Easter eggs. I am the Easter egg.",
  "It looks like you're checking the weather. It's a nice day to hire someone.",
  "Tip: Try the Konami code. ↑↑↓↓←→←→BA. Don't say I didn't warn you.",
];

const isAntivirusMsg = (msg: string) => msg.toLowerCase().includes('antivirus');

export default function Clippy() {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [waving, setWaving] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text?: string, persist = false) => {
    const m = text ?? MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMsg(m);
    setVisible(true);
    setWaving(true);
    setInputText('');
    setTimeout(() => setWaving(false), 1000);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!persist) timeoutRef.current = setTimeout(() => setVisible(false), 8000);
  };

  useEffect(() => {
    // First appearance after 15s
    const first = setTimeout(() => showMessage(), 15000);
    // Then every 60-90s
    const interval = setInterval(() => showMessage(), 75000);
    return () => { clearTimeout(first); clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    _clippyShow = (m, persist) => {
      setMsg(m);
      setVisible(true);
      setWaving(true);
      setInputText('');
      setTimeout(() => setWaving(false), 1000);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (!persist) timeoutRef.current = setTimeout(() => setVisible(false), 8000);
    };
    return () => { _clippyShow = null; };
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleVirusChoice = () => {
    setMsg('Installing antivirus... 🛡️');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 2500);
    _virusCallback?.();
  };

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = inputText.trim();
    if (!question || aiLoading) return;
    setAiLoading(true);
    setMsg('...');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      const res = await fetch('/api/clippy-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      setMsg(data.reply ?? "I'm having trouble thinking right now.");
      timeoutRef.current = setTimeout(() => setVisible(false), 10000);
    } catch {
      setMsg("I'm having trouble thinking right now.");
      timeoutRef.current = setTimeout(() => setVisible(false), 6000);
    } finally {
      setAiLoading(false);
      setInputText('');
    }
  };

  const showAntivirus = isAntivirusMsg(msg);

  return (
    <div style={{ position: 'fixed', bottom: 52, right: 16, zIndex: 8000, userSelect: 'none' }}>
      {/* Speech bubble */}
      {visible && (
        <div style={{
          position: 'absolute', bottom: 90, right: 0,
          width: 240,
          background: 'rgba(255,255,220,0.97)',
          border: '1px solid #cca',
          borderRadius: 6,
          padding: '8px 10px 8px 10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          fontFamily: 'Tahoma, sans-serif',
          fontSize: 11,
          color: '#222',
          lineHeight: 1.5,
        }}>
          <div style={{ marginBottom: showAntivirus ? 8 : 0 }}>{msg}</div>

          {/* Antivirus Yes/No buttons */}
          {showAntivirus && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <button
                onClick={handleVirusChoice}
                style={{ flex: 1, fontSize: 10, padding: '3px 0', cursor: 'pointer', background: '#d4eaff', border: '1px solid #0078d7', borderRadius: 3, fontFamily: 'Tahoma, sans-serif', color: '#003380', fontWeight: 'bold' }}
              >
                Yes please
              </button>
              <button
                onClick={handleVirusChoice}
                style={{ flex: 1, fontSize: 10, padding: '3px 0', cursor: 'pointer', background: '#e8ecf8', border: '1px solid #aac', borderRadius: 3, fontFamily: 'Tahoma, sans-serif' }}
              >
                No thanks
              </button>
            </div>
          )}

          {/* AI Q&A input */}
          {!showAntivirus && (
            <form onSubmit={handleAskSubmit} style={{ marginTop: 6, display: 'flex', gap: 4 }}>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                disabled={aiLoading}
                style={{
                  flex: 1, fontSize: 10, padding: '2px 6px',
                  border: '1px solid #aac', borderRadius: 3,
                  fontFamily: 'Tahoma, sans-serif',
                  background: aiLoading ? '#f0f0f0' : '#fff',
                  color: '#222',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={aiLoading || !inputText.trim()}
                style={{
                  fontSize: 10, padding: '2px 6px', cursor: aiLoading ? 'default' : 'pointer',
                  background: '#d4eaff', border: '1px solid #0078d7', borderRadius: 3,
                  fontFamily: 'Tahoma, sans-serif', color: '#003380',
                  opacity: aiLoading || !inputText.trim() ? 0.5 : 1,
                }}
              >
                Ask
              </button>
            </form>
          )}

          {/* Standard dismiss buttons */}
          {!showAntivirus && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 6 }}>
              <button
                onClick={dismiss}
                style={{ fontSize: 10, padding: '2px 8px', cursor: 'pointer', background: '#e8ecf8', border: '1px solid #aac', borderRadius: 3, fontFamily: 'Tahoma, sans-serif' }}
              >
                OK
              </button>
              <button
                onClick={() => { dismiss(); }}
                style={{ fontSize: 10, padding: '2px 8px', cursor: 'pointer', background: '#e8ecf8', border: '1px solid #aac', borderRadius: 3, fontFamily: 'Tahoma, sans-serif' }}
              >
                Stop helping me
              </button>
            </div>
          )}

          {/* Triangle pointer */}
          <div style={{
            position: 'absolute', bottom: -8, right: 30,
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(255,255,220,0.97)',
          }} />
        </div>
      )}

      {/* Clippy body - clickable */}
      <div
        onClick={() => showMessage()}
        title="Click me!"
        style={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: waving ? 'rotate(-12deg) scale(1.12)' : 'rotate(0deg) scale(1)',
          filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clippy.png" alt="Clippy" style={{ width: 90, height: 'auto', display: 'block' }} />
      </div>
    </div>
  );
}
