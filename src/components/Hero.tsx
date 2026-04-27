import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

const techStack = [
  "Next.js",
  "TypeScript",
  "Swift",
  "SwiftUI",
  "React",
  "Supabase",
  "Claude AI",
  "HealthKit",
  "Python",
  "Tailwind CSS",
  "PostgreSQL",
  "Node.js",
  "WatchConnectivity",
  "Google Places API",
];

const marqueeItems = [...techStack, ...techStack];

export function Hero() {
  return (
    <section className="dot-grid relative flex min-h-screen flex-col overflow-hidden pt-16">
      {/* Violet radial glow at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh]"
        style={{
          background:
            "radial-gradient(ellipse 75% 50% at 50% 0%, rgba(109,40,217,0.1), transparent)",
        }}
      />

      {/* Bottom fade so dot grid doesn't bleed into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to top, var(--background), transparent)",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-1 flex-col justify-end px-6 pb-10 md:px-12">
        {/* Role / school label */}
        <p
          className="animate-fade-up mb-6 text-xs font-medium uppercase tracking-[0.2em] text-violet-400"
          style={{ animationDelay: "0ms" }}
        >
          CS + Business&nbsp;&nbsp;·&nbsp;&nbsp;Georgia State University&nbsp;&nbsp;·&nbsp;&nbsp;Fall 2027
        </p>

        {/* Name — ADAM solid, OSMAN outlined */}
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1
            className="block font-bold leading-none"
            style={{
              fontSize: "clamp(3.25rem, 11.5vw, 10rem)",
              letterSpacing: "-0.035em",
            }}
          >
            <span className="block text-white">ADAM</span>
            <span
              className="block"
              style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,0.45)",
                color: "transparent",
              }}
            >
              OSMAN
            </span>
          </h1>
        </div>

        {/* Animated shimmer subtitle */}
        <div className="animate-fade-up mt-4" style={{ animationDelay: "160ms" }}>
          <AnimatedGradientText className="text-base font-medium md:text-lg">
            founder. builder. CS student.
          </AnimatedGradientText>
        </div>

        {/* Thin rule */}
        <div
          className="animate-fade-up mt-8 h-px w-full"
          style={{
            animationDelay: "220ms",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {/* Description + CTAs */}
        <div
          className="animate-fade-up mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          style={{ animationDelay: "280ms" }}
        >
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            Building AI products at the intersection of technology and
            real-world impact — from helping students navigate syllabi to
            helping Parkinson&apos;s patients move more confidently.
          </p>
          <div className="flex shrink-0 gap-3">
            <a
              href="#projects"
              className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-violet-600"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-white/20 hover:text-white"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Tech stack marquee */}
      <div
        className="animate-fade-up relative overflow-hidden border-t border-white/[0.06] py-4"
        style={{ animationDelay: "340ms" }}
      >
        <div className="animate-marquee flex gap-10">
          {marqueeItems.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
