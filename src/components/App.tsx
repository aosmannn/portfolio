'use client';

import { useState } from 'react';
import Desktop from './Desktop';
import WelcomeScreen from './WelcomeScreen';

export default function App() {
  const [welcomed, setWelcomed] = useState(false);

  return (
    <>
      {/* Mobile notice */}
      <div
        className="mobile-notice"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10001,
          background: '#000',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          color: 'white',
          fontFamily: 'Tahoma, sans-serif',
          textAlign: 'center',
          padding: 32,
        }}
      >
        <div style={{ fontSize: 48 }}>🖥️</div>
        <div style={{ fontSize: 20, fontWeight: 'bold' }}>Desktop Required</div>
        <div style={{ fontSize: 13, color: '#888', maxWidth: 280 }}>
          This portfolio runs as a Windows XP desktop environment. Please visit on a desktop or laptop computer.
        </div>
      </div>

      {/* Desktop environment */}
      <div className="desktop-env">
        {!welcomed ? (
          <WelcomeScreen onEnter={() => setWelcomed(true)} />
        ) : (
          <Desktop />
        )}
      </div>
    </>
  );
}
