export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-12">
        <span className="text-sm font-semibold text-white">Adam Osman</span>
        <nav className="flex gap-6">
          <a
            href="#projects"
            className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
          >
            Projects
          </a>
          <a
            href="#about"
            className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-sm text-zinc-400 transition-colors duration-200 hover:text-violet-400"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
