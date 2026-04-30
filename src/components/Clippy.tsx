'use client';

import { useEffect, useState, useRef } from 'react';

declare global { interface Window { __nowPlaying?: { title: string; artist?: string; album?: string } | null; } }

type ShowFn = (msg: string, persist?: boolean) => void;
let _clippyShow: ShowFn | null = null;
export function triggerClippyMessage(msg: string, persist = false) {
  _clippyShow?.(msg, persist);
}

let _virusCallback: (() => void) | null = null;
export function setVirusCallback(fn: () => void) { _virusCallback = fn; }

const RANDOM_MESSAGES = [
  "It looks like you're viewing a portfolio. Want me to annoy you about it?",
  "Have you considered hiring Adam? Just a thought. I'm not biased.",
  "Did you know Adam built this entire Windows 7 UI from scratch? Wild right?",
  "It looks like you're procrastinating. Can I help you procrastinate better?",
  "ERROR: Too much talent detected in this portfolio. Please contact HR.",
  "Fun fact: This screensaver is actually a portfolio. Tricked ya.",
  "Adam is available for hire. This message was not approved by Adam.",
  "Right-click the desktop. Go ahead. I won't tell you what happens.",
  "I heard you like Easter eggs. I am the Easter egg.",
  "Tip: Try the Konami code. ↑↑↓↓←→←→BA. Don't say I didn't warn you.",
];

const isAntivirusMsg = (msg: string) => msg.toLowerCase().includes('antivirus');

interface ChatEntry { role: 'clippy' | 'user'; text: string; timestamp: number; }
const HISTORY_KEY = 'clippy-chat-history';

export default function Clippy() {
  const [chatOpen, setChatOpen] = useState(false);
  const [waving, setWaving] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'); } catch { return []; }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const virusPendingRef = useRef(false);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const addMessage = (entries: ChatEntry[]) => {
    setMessages(prev => {
      const next = [...prev, ...entries].slice(-60);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    scrollToBottom();
  };

  const pushClippyMsg = (text: string) => {
    addMessage([{ role: 'clippy', text, timestamp: Date.now() }]);
    setWaving(true);
    setTimeout(() => setWaving(false), 1000);
  };

  // Random messages every 75s, first after 15s
  useEffect(() => {
    const first = setTimeout(() => {
      pushClippyMsg(RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)]);
    }, 15000);
    const interval = setInterval(() => {
      pushClippyMsg(RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)]);
    }, 75000);
    return () => { clearTimeout(first); clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External trigger (e.g. virus easter egg, window context tips)
  useEffect(() => {
    _clippyShow = (text) => {
      pushClippyMsg(text);
      setChatOpen(true);
      setWaving(true);
      setTimeout(() => setWaving(false), 1000);
      if (isAntivirusMsg(text)) virusPendingRef.current = true;
    };
    return () => { _clippyShow = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Virus easter egg - 20s antivirus prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('clippy-virus-shown')) return;
    const t = setTimeout(() => {
      if (!sessionStorage.getItem('clippy-virus-shown')) {
        sessionStorage.setItem('clippy-virus-shown', '1');
        pushClippyMsg("It looks like you're browsing without antivirus. Should I install one?");
        virusPendingRef.current = true;
        setChatOpen(true);
      }
    }, 20000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVirusChoice = (yes: boolean) => {
    virusPendingRef.current = false;
    if (yes) {
      addMessage([{ role: 'user', text: 'Yes please', timestamp: Date.now() }]);
      pushClippyMsg('Installing antivirus... 🛡️');
      _virusCallback?.();
    } else {
      addMessage([{ role: 'user', text: 'No thanks', timestamp: Date.now() }]);
      pushClippyMsg("Smart choice. Probably.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = inputText.trim();
    if (!question || aiLoading) return;
    setInputText('');
    addMessage([{ role: 'user', text: question, timestamp: Date.now() }]);
    setAiLoading(true);
    try {
      const res = await fetch('/api/clippy-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question, nowPlaying: window.__nowPlaying ?? null }),

      });
      const data = await res.json();
      pushClippyMsg(data.reply ?? "I'm having trouble thinking right now.");
    } catch {
      pushClippyMsg("I'm having trouble thinking right now.");
    } finally {
      setAiLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const lastMsg = messages[messages.length - 1];
  const showAntivirusButtons = virusPendingRef.current && lastMsg?.role === 'clippy' && isAntivirusMsg(lastMsg?.text ?? '');

  return (
    <div style={{ position: 'fixed', bottom: 52, right: 16, zIndex: 8000, userSelect: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>

      {/* Full Chat Window */}
      {chatOpen && (
        <div style={{
          width: 300,
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(240,244,255,0.98)',
          border: '1px solid rgba(100,140,220,0.5)',
          borderRadius: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          fontFamily: 'Tahoma, sans-serif',
        }}>
          {/* Title bar */}
          <div style={{
            background: 'linear-gradient(180deg, #3a7bd5 0%, #1a5bb5 100%)',
            padding: '5px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/clippy.png" alt="" style={{ width: 20, height: 'auto' }} />
              <span style={{ color: 'white', fontSize: 11, fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Clippy</span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'linear-gradient(180deg,#e74c3c,#c0392b)', border: '1px solid #922b21',
                color: '#fff', width: 18, height: 18, cursor: 'pointer',
                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2, fontWeight: 'bold', padding: 0,
              }}
            >✕</button>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '8px 10px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {messages.length === 0 && (
              <div style={{ color: '#888', fontSize: 11, textAlign: 'center', marginTop: 40 }}>
                👋 Hi! I&apos;m Clippy. Ask me anything about Adam or anything at all!
              </div>
            )}
            {messages.map((entry, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: entry.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: 5,
              }}>
                {entry.role === 'clippy' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/clippy.png" alt="" style={{ width: 24, height: 'auto', flexShrink: 0, marginBottom: 2 }} />
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '5px 8px',
                  borderRadius: entry.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                  background: entry.role === 'user' ? '#0078d7' : 'rgba(255,255,200,0.95)',
                  color: entry.role === 'user' ? '#fff' : '#222',
                  fontSize: 11,
                  lineHeight: 1.5,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  border: entry.role === 'clippy' ? '1px solid #ddc' : 'none',
                }}>
                  {entry.text}
                </div>
              </div>
            ))}

            {/* Antivirus buttons */}
            {showAntivirusButtons && (
              <div style={{ display: 'flex', gap: 6, paddingLeft: 30 }}>
                <button onClick={() => handleVirusChoice(true)} style={{ flex: 1, fontSize: 10, padding: '4px 0', cursor: 'pointer', background: '#d4eaff', border: '1px solid #0078d7', borderRadius: 4, color: '#003380', fontWeight: 'bold' }}>
                  Yes please
                </button>
                <button onClick={() => handleVirusChoice(false)} style={{ flex: 1, fontSize: 10, padding: '4px 0', cursor: 'pointer', background: '#e8ecf8', border: '1px solid #aac', borderRadius: 4 }}>
                  No thanks
                </button>
              </div>
            )}

            {aiLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/clippy.png" alt="" style={{ width: 24, height: 'auto', flexShrink: 0 }} />
                <div style={{ padding: '5px 10px', borderRadius: '10px 10px 10px 2px', background: 'rgba(255,255,200,0.95)', border: '1px solid #ddc', fontSize: 13, color: '#888' }}>
                  ···
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clear button */}
          <div style={{ padding: '2px 10px', display: 'flex', justifyContent: 'flex-end', background: 'rgba(230,235,250,0.8)' }}>
            <button onClick={() => { setMessages([]); localStorage.removeItem(HISTORY_KEY); }} style={{ fontSize: 9, color: '#a00', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Tahoma, sans-serif' }}>
              Clear history
            </button>
          </div>

          {/* Input area */}
          <form onSubmit={handleSend} style={{
            display: 'flex', gap: 6, padding: '8px 10px',
            borderTop: '1px solid rgba(100,140,220,0.3)',
            background: 'rgba(220,228,248,0.8)',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type a message..."
              disabled={aiLoading}
              autoFocus
              style={{
                flex: 1, fontSize: 11, padding: '4px 8px',
                border: '1px solid #aac', borderRadius: 3,
                fontFamily: 'Tahoma, sans-serif',
                background: aiLoading ? '#f0f0f0' : '#fff',
                color: '#222', outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={aiLoading || !inputText.trim()}
              style={{
                fontSize: 10, padding: '4px 10px',
                background: 'linear-gradient(180deg, #3a7bd5, #1a5bb5)',
                border: '1px solid #0056a3', borderRadius: 3,
                color: '#fff', cursor: aiLoading ? 'default' : 'pointer',
                opacity: aiLoading || !inputText.trim() ? 0.5 : 1,
                fontFamily: 'Tahoma, sans-serif',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Clippy image + chat toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => { setChatOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 100); }}
          style={{
            fontSize: 10, padding: '3px 12px',
            background: chatOpen ? 'rgba(0,120,215,0.15)' : 'rgba(255,255,220,0.95)',
            border: `1px solid ${chatOpen ? '#0078d7' : '#cca'}`,
            borderRadius: 10, fontFamily: 'Tahoma, sans-serif',
            color: chatOpen ? '#003380' : '#554',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
        >
          {chatOpen ? '✕ Close Chat' : '💬 Chat with Clippy'}
        </button>

        <div
          onClick={() => { setChatOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
          title="Click to chat!"
          style={{
            cursor: 'pointer',
            transition: 'transform 0.2s',
            transform: waving ? 'rotate(-12deg) scale(1.12)' : 'rotate(0deg) scale(1)',
            filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clippy.png" alt="Clippy" style={{ width: 120, height: 'auto', display: 'block' }} />
        </div>
      </div>
    </div>
  );
}
