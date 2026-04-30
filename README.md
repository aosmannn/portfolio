# Adam Osman — Windows 7 Portfolio

Live at **https://adamosman.dev**

A fully interactive Windows 7-themed developer portfolio built with Next.js 16 + React 19. Features a working desktop with draggable windows, taskbar, start menu, Clippy AI assistant, real screen capture snipping tool, and more — running entirely in the browser.

---

## Features

- **Windows 7 Aero UI** — glassmorphism window chrome, Aero-style gradients, and pixel-accurate taskbar
- **Draggable & resizable windows** — every app opens in a moveable window with minimize/close controls
- **Start Menu** — working start menu with app launcher
- **Taskbar** — pinned apps, open window buttons, system tray, and live clock
- **Clippy AI chat** — powered by Anthropic Claude; answers questions about Adam and makes small talk
- **Snipping Tool** — real screen capture using the browser's Screen Capture API
- **Weather widget** — live weather data on the desktop
- **GitHub activity feed** — shows recent GitHub contributions
- **Wakatime coding stats** — live coding time, top languages, and top projects
- **Blog system** — built-in blog with posts about Adam's projects and journey
- **Wallpaper picker** — switch between Windows Aero wallpapers via right-click Personalize
- **Konami code easter egg** — try it
- **Virus + BSOD easter egg** — Clippy has opinions about your antivirus situation
- **Boot screen** — animated Windows 7-style boot sequence on first visit
- **Sticky Notes** — draggable sticky notes on the desktop
- **Music Player** — Spotify-style music integration
- **Command Prompt** — a fun interactive cmd.exe experience

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS, inline styles |
| AI | Anthropic Claude API (claude-haiku-4-5) |
| Database | Supabase |
| Deployment | Vercel |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/aosmannn/portfolio.git
cd portfolio

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your keys:
# ANTHROPIC_API_KEY=
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# WAKATIME_API_KEY=        (optional — for coding stats)
# OPENWEATHER_API_KEY=     (optional — for weather widget)

# 4. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the portfolio.

---

## Author

**Adam Osman** — [adamosman.dev](https://adamosman.dev)

- GitHub: [@aosmannn](https://github.com/aosmannn)
- LinkedIn: [linkedin.com/in/adamogsu](https://linkedin.com/in/adamogsu)
