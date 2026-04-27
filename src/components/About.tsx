import { Reveal } from "@/components/Reveal";

const currently = [
  "Building CourseConnect AI",
  "Studying CS + Business at Georgia State",
  "Seeking internships & research roles",
];

export function About() {
  return (
    <section
      id="about"
      className="border-t border-white/[0.06] py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            About
          </span>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-[280px_1fr]">
          {/* Left — currently block */}
          <Reveal delay={60}>
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-zinc-600">
                Currently
              </p>
              <ul className="space-y-2">
                {currently.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-zinc-500">
                    <span className="mt-px text-violet-600" aria-hidden="true">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Applied AI", "Mobile Dev", "Full-Stack Web", "Healthtech"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/[0.07] px-3 py-1 text-xs text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — bio */}
          <Reveal delay={120}>
            <div className="space-y-5 text-base leading-relaxed text-zinc-400">
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
                problems — from helping students navigate their syllabi to
                helping Parkinson&apos;s patients move more confidently.
              </p>
              <p>
                My interests span applied AI, mobile development, and full-stack
                web. I&apos;m drawn to problems where software can meaningfully
                reduce friction in someone&apos;s day — whether that&apos;s a
                student trying to understand their course expectations or a
                patient trying to maintain their independence.
              </p>
              <p>
                I&apos;m actively looking for internships and research
                opportunities where I can work on hard problems with a sharp
                team. If that sounds like you, I&apos;d love to connect.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
