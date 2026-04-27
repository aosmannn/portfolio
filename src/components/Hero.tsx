import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-400">
          CS + Business · Georgia State University · Fall 2027
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
          Adam Osman
        </h1>
        <AnimatedGradientText className="text-lg md:text-xl">
          founder. builder. CS student.
        </AnimatedGradientText>
        <p className="mt-2 max-w-md text-base leading-relaxed text-zinc-400">
          Building at the intersection of AI and real-world problems — from
          helping students navigate syllabi to helping Parkinson&apos;s patients
          move more confidently.
        </p>
        <div className="mt-6 flex gap-4">
          <a
            href="#projects"
            className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 transition-colors duration-200 hover:border-violet-400/60 hover:bg-violet-500/20"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-zinc-600 hover:text-white"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
