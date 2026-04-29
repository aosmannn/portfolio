# Adam Osman's Portfolio — Windows 7 Edition

**Live site:** [https://adamosman.dev](https://adamosman.dev)

A fully interactive Windows 7-style desktop OS built as a developer portfolio site. Every window opens, drags, resizes, and minimizes — it's a real desktop simulation running entirely in the browser.

---

## Features

### Desktop & Shell

- **Windows 7 Login Screen** — greets visitors with Adam's photo before loading the desktop
- **Boot Screen Animation** — plays a Windows 7-style boot animation on the very first visit
- **Draggable Desktop Icons** — icons arranged in a 2-column layout; positions are saved to `localStorage` and persist across visits
- **Draggable Windows** — every app window can be opened, minimized to the taskbar, resized, and dragged freely around the desktop
- **Taskbar** — shows open/minimized windows; click to bring a window to focus or restore it
- **Right-Click Context Menu** — right-click anywhere on the desktop to get a context menu (refresh, view options, etc.)
- **Search Overlay** — press `Ctrl+F` or the Win key to open a full-screen search overlay
- **Screensaver** — activates automatically after a configurable idle period

### System Tray (Real Browser APIs)

- **Battery %** — reads real battery level via the Web Battery API
- **Wi-Fi Status** — reflects actual online/offline network state
- **Volume Control** — functional volume slider using the Web Audio API

### App Windows

- **About Me** — photo, bio, and a quick intro to Adam
- **Projects** — pulls live repositories directly from the [aosmannn](https://github.com/aosmannn) GitHub account via the GitHub API; always up to date
- **Resume** — inline resume viewer
- **Contact** — working email contact form powered by [Resend](https://resend.com)
- **Skills & XP** — animated progress bars for tech skills, an experience/education timeline, and live coding stats fetched from the Wakatime API
- **Task Manager** — fake Windows process list (a love letter to `Ctrl+Alt+Del`)
- **Command Prompt** — fake CMD prompt supporting commands: `dir`, `whoami`, `ipconfig`, `hire adam`, and more
- **GitHub Activity** — live public event feed from the aosmannn GitHub account
- **Blog** — blog reader window, plus a blog widget pinned to the desktop
- **Recycle Bin** — exactly what you'd expect
- **Snipping Tool** — Snipping Tool window (Windows classics deserve respect)
- **Music Player** — hidden by default; open it from the taskbar

### Widgets (Draggable)

- **Sticky Notes** — draggable, persistent notes saved to `localStorage`
- **Calendar Widget** — draggable, shows the current month
- **Weather Widget** — current weather conditions

### Easter Eggs

- **Clippy** — the AI assistant is back. Powered by **Claude Haiku** (claude-haiku-4-20250514). Clippy appears with random tips, maintains a full chat history, and has an "Ask me anything" input. Trigger the virus easter egg: answer the antivirus prompt wrong and Clippy betrays you — full **BSOD** with `CLIPPY_BETRAYAL_EXCEPTION`.
- **BSOD** — type `bsod` anywhere on the desktop to trigger a Blue Screen of Death. The BSOD displays a QR code linking to Adam's LinkedIn profile.
- **Konami Code** — ↑ ↑ ↓ ↓ ← → ← → B A. You know what to do.
- **Fake Error Popups** — random Windows-style error dialogs appear at unpredictable intervals. Classic.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| UI | React 19, TypeScript |
| Hosting | Vercel |
| Email | Resend |
| AI (Clippy) | Claude Haiku (`claude-haiku-4-20250514`) via Anthropic API |
| Coding Stats | Wakatime API |
| Live Repos | GitHub REST API |

---

## Author

**Adam Osman**
CS + Business student at Georgia State University
Founder of [CourseConnect AI](https://www.courseconnectai.com/)

- GitHub: [https://github.com/aosmannn](https://github.com/aosmannn)
- Live Portfolio: [https://adamosman.dev](https://adamosman.dev)
