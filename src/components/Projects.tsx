import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/Reveal";

function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <div className="group relative flex flex-col gap-6 py-10 md:flex-row md:items-start md:gap-10">
      {/* Number */}
      <span className="w-8 shrink-0 text-xs font-medium tabular-nums text-zinc-700 md:mt-1">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-violet-300">
            {project.title}
          </h3>
          {project.status === "coming-soon" ? (
            <span className="shrink-0 rounded-full border border-zinc-800 px-3 py-1 text-[11px] font-medium text-zinc-600">
              Coming soon
            </span>
          ) : (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title}`}
              className="shrink-0 rounded-lg border border-white/[0.08] p-2 text-zinc-600 transition-all duration-200 hover:border-violet-500/40 hover:text-violet-400"
            >
              <ArrowUpRight size={15} />
            </a>
          )}
        </div>

        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3">
          {project.stack.map((tech, i) => (
            <span key={tech} className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-600">{tech}</span>
              {i < project.stack.length - 1 && (
                <span className="text-zinc-800">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="border-t border-white/[0.06] py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Reveal>
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Projects
            </span>
            <span className="text-xs text-zinc-700">{projects.length} total</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="mb-16 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Things I&apos;ve shipped.
          </h2>
        </Reveal>

        <div className="divide-y divide-white/[0.05]">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 80}>
              <ProjectRow project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
