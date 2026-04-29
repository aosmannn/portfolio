export default function AboutWindow() {
  return (
    <div className="win-content">
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/adam.jpeg" alt="Adam Osman" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(100,140,220,0.4)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003380' }}>Adam Osman</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>CS Student &amp; Founder</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>Georgia State University · Graduating Fall 2027</div>
        </div>
      </div>

      <div className="xp-separator" />

      <div className="win-section-title">About Me</div>
      <p style={{ marginBottom: 12, lineHeight: 1.6 }}>
        Hey! I&apos;m Adam, a 19-year-old CS student at Georgia State University and founder of
        CourseConnect AI. I build AI-powered products that solve real problems for students and
        everyday people. I&apos;m passionate about shipping fast, learning in public, and making
        technology feel magical.
      </p>

      <div className="win-section-title">Currently</div>
      <ul style={{ paddingLeft: 18, lineHeight: 2, marginBottom: 12 }}>
        <li>Building <strong>CourseConnect AI</strong> — AI syllabus reader for college students</li>
        <li>Studying CS at Georgia State University</li>
        <li>Exploring iOS/watchOS development with <strong>GaitGuard</strong></li>
        <li>Open-sourcing <strong>PlanDrop</strong> for friend-group activity planning</li>
      </ul>

      <div className="win-section-title">Interests</div>
      <div style={{ marginBottom: 16 }}>
        {['AI/LLMs', 'Full-Stack Dev', 'iOS Development', 'Startups', 'UX Design', 'Open Source'].map((tag) => (
          <span key={tag} className="xp-tag">{tag}</span>
        ))}
      </div>

      <a
        href="https://github.com/aosmannn"
        target="_blank"
        rel="noopener noreferrer"
        className="aero-btn"
        style={{ display: 'inline-block', textDecoration: 'none' }}
      >
        🐙 GitHub Profile
      </a>
    </div>
  );
}
