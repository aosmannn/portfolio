import { ArrowUpRight } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";

interface Project {
  title: string;
  description: string;
  stack: string[];
  href: string;
  linkLabel?: string;
}

const projects: Project[] = [
  {
    title: "CourseConnect AI",
    description:
      "AI-powered syllabus reader and class assistant for college students. Parses syllabi, extracts deadlines and grading policies, and provides context-aware tutoring via vector search.",
    stack: ["Next.js", "React 19", "Claude AI", "Supabase"],
    href: "https://www.courseconnectai.com",
  },
  {
    title: "GaitGuard AI",
    description:
      "iOS + watchOS app that monitors gait via Apple Watch and delivers rhythmic haptic cueing for Parkinson's patients to improve movement confidence.",
    stack: ["Swift", "SwiftUI", "HealthKit", "WatchConnectivity"],
    href: "#",
    linkLabel: "Coming soon",
  },
  {
    title: "PlanDrop",
    description:
      "Friend-group activity planner with AI-generated plans and real-time claim mechanics. Integrates Google Places and live Supabase updates for a dynamic planning experience.",
    stack: ["Next.js", "Supabase", "Claude AI", "Google Places"],
    href: "https://github.com/aosmannn/PlanDrop-1",
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-zinc-800/60 py-24"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-white">
          Projects
        </h2>
        <p className="mb-12 text-base text-zinc-500">
          Things I&apos;ve shipped.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <MagicCard key={project.title} className="flex flex-col p-6">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {project.title}
                </h3>
                {project.href !== "#" ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-zinc-500 transition-colors duration-200 hover:text-violet-400"
                    aria-label={`Visit ${project.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <span className="shrink-0 text-xs text-zinc-600">
                    {project.linkLabel}
                  </span>
                )}
              </div>
              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
