export function About() {
  return (
    <section
      id="about"
      className="border-t border-zinc-800/60 py-24"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <div className="max-w-2xl">
          <h2 className="mb-12 text-3xl font-semibold tracking-tight text-white">
            About
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-zinc-300">
            <p>
              I&apos;m a Computer Science student at Georgia State University
              (graduating Fall 2027) and founder of{" "}
              <a
                href="https://www.courseconnectai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 underline underline-offset-2 transition-colors duration-200 hover:text-violet-300"
              >
                CourseConnect AI
              </a>
              . I build products at the intersection of AI and real-world
              problems — from helping students navigate their syllabi to helping
              Parkinson&apos;s patients move more confidently.
            </p>
            <p>
              My interests span applied AI, mobile development, and full-stack
              web. I&apos;m drawn to problems where software can meaningfully
              reduce friction in someone&apos;s day — whether that&apos;s a
              student trying to understand their course expectations or a patient
              trying to maintain their independence.
            </p>
            <p>
              I&apos;m actively looking for internships and research
              opportunities where I can work on hard problems with a sharp team.
              If that sounds like you, I&apos;d love to connect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
