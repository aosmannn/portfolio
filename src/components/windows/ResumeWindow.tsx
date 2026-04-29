'use client';

export default function ResumeWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 12px', boxSizing: 'border-box', gap: 10 }}>
      {/* Download button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href="/adam-osman.pdf"
          download="Adam-Osman-Resume.pdf"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', fontSize: 12,
            background: 'linear-gradient(180deg, #e8f0ff 0%, #c8d8f8 100%)',
            border: '1px solid #0078d7', borderRadius: 3,
            color: '#003380', fontFamily: 'Tahoma, sans-serif',
            textDecoration: 'none', fontWeight: 'bold',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          ⬇ Download Resume
        </a>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1, border: '1px solid #c0c8d8', borderRadius: 2, overflow: 'hidden', background: '#525659' }}>
        <iframe
          src="https://docs.google.com/viewer?url=https://adamosman.dev/adam-osman.pdf&embedded=true"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Adam Osman Resume"
        />
      </div>
    </div>
  );
}
