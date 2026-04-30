'use client';

import { useEffect, useState } from 'react';

export default function IEWindow() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visitor-count')
      .then(r => r.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => setVisitorCount(1337));
  }, []);

  const displayCount = visitorCount !== null ? visitorCount.toLocaleString() : '...';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Tahoma, sans-serif', background: '#f0f0f0' }}>
      {/* IE Toolbar */}
      <div style={{
        background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
        borderBottom: '1px solid #c0c0c0',
        padding: '4px 8px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {/* Nav buttons */}
        {['◀', '▶', '↻'].map((btn, i) => (
          <button key={i} title={['Back', 'Forward', 'Refresh'][i]} style={{
            width: 26, height: 24,
            background: 'linear-gradient(180deg, #fff 0%, #e0e0e0 100%)',
            border: '1px solid #aaa', borderRadius: 3,
            fontSize: 11, cursor: 'default', color: '#888',
          }}>{btn}</button>
        ))}

        {/* Address bar */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          background: 'white', border: '1px solid #a0a0d0',
          borderRadius: 2, padding: '0 8px', height: 24,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <span style={{ fontSize: 11, color: '#444' }}>http://adamosman.dev/hire-me.html</span>
        </div>

        {/* Go button */}
        <button style={{
          padding: '2px 12px', height: 24,
          background: 'linear-gradient(180deg, #e8f0ff 0%, #c0d4f8 100%)',
          border: '1px solid #8090d0', borderRadius: 2,
          fontSize: 11, cursor: 'default', color: '#003380',
        }}>Go</button>
      </div>

      {/* IE "page" content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#c0c0c0',
        padding: 0,
      }}>
        {/* Fake browser viewport */}
        <div style={{
          background: '#ffffff',
          minHeight: '100%',
          padding: '20px 40px',
          fontFamily: '"Times New Roman", serif',
        }}>
          {/* marquee effect via CSS */}
          <div style={{
            background: '#ff0000', color: '#ffff00',
            textAlign: 'center', padding: '4px 0',
            fontFamily: 'Comic Sans MS, cursive',
            fontSize: 13,
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            ★ ★ ★ &nbsp; WELCOME TO MY PROFESSIONAL WEBPAGE &nbsp; ★ ★ ★ &nbsp;&nbsp; PLEASE DO NOT STEAL MY HTML &nbsp;&nbsp; ★ ★ ★
          </div>

          {/* Main heading */}
          <h1 style={{
            fontFamily: '"Comic Sans MS", cursive',
            fontSize: 36, color: '#000099',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,200,0.3)',
            margin: '0 0 4px',
          }}>
            HIRE ADAM OSMAN
          </h1>

          <div style={{ textAlign: 'center', fontSize: 11, color: '#666', marginBottom: 16 }}>
            <span style={{ textDecoration: 'blink' }}>★ Best viewed in Internet Explorer 6.0 at 800×600 resolution ★</span>
          </div>

          <hr style={{ border: '3px ridge #000099', marginBottom: 16 }} />

          {/* Hit counter */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              display: 'inline-block',
              background: '#000', color: '#00ff00',
              fontFamily: '"Courier New", monospace',
              fontSize: 18, padding: '4px 16px',
              border: '2px inset #888',
            }}>
              {visitorCount !== null ? visitorCount : '...'}
            </div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
              You are visitor #{displayCount}! Congratulations!
            </div>
          </div>

          {/* Profile photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/adam.jpeg" alt="Adam Osman" style={{
            float: 'right', margin: '0 0 16px 24px',
            border: '4px ridge #000099',
            width: 120, height: 120,
            objectFit: 'cover', objectPosition: 'center top',
          }} />

          <h2 style={{ fontFamily: '"Comic Sans MS", cursive', color: '#cc0000', fontSize: 20 }}>
            About Me 😊
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Hello! My name is Adam Osman. I am a <b>VERY SKILLED</b> computer person
            who knows about the internet and also JavaScript. Please hire me immediately.
            Thank you.
          </p>

          <h2 style={{ fontFamily: '"Comic Sans MS", cursive', color: '#cc0000', fontSize: 20 }}>
            My Skillz 💻
          </h2>
          <ul style={{ fontSize: 13, lineHeight: 2 }}>
            <li>✅ Making websites that look like this one</li>
            <li>✅ Founder of CourseConnect AI (it is on the internet)</li>
            <li>✅ Georgia State University student (very prestigious)</li>
            <li>✅ Fixing bugs at 3am (extensive experience)</li>
          </ul>

          <h2 style={{ fontFamily: '"Comic Sans MS", cursive', color: '#cc0000', fontSize: 20 }}>
            References
          </h2>
          <p style={{ fontSize: 13 }}>
            &quot;Adam is the best programmer I have ever seen.&quot; — My mom<br />
            &quot;Who are you?&quot; — Elon Musk (probably)<br />
            &quot;Hire this person.&quot; — Clippy
          </p>

          <div style={{ clear: 'both' }} />
          <hr style={{ border: '3px ridge #000099', margin: '16px 0' }} />

          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {[
              { bg: '#0000aa', color: '#fff', text: '🌐 Best Viewed in IE 6.0' },
              { bg: '#3366cc', color: '#fff', text: '📧 Email Me Maybe' },
              { bg: '#cc0000', color: '#fff', text: '🔥 This Page Is On Fire' },
              { bg: '#006600', color: '#fff', text: '♻️ Netscape Compatible' },
            ].map((badge, i) => (
              <div key={i} style={{
                background: badge.bg, color: badge.color,
                fontSize: 10, fontWeight: 'bold',
                padding: '3px 8px', borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.3)',
              }}>
                {badge.text}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: '#888', marginTop: 12 }}>
            © 2009 Adam Osman Productions™ | Last updated: never | Made with Microsoft FrontPage 98
          </div>
        </div>
      </div>

      {/* IE Status bar */}
      <div style={{
        background: '#f0f0f0', borderTop: '1px solid #c0c0c0',
        padding: '2px 8px', fontSize: 11, color: '#555',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Done</span>
        <span>⊕ Internet</span>
      </div>
    </div>
  );
}
