# Pomodoro For Students

> Focus better, one pomodoro at a time.

A modern, minimal Pomodoro timer application with task management, session tracking, and multilingual support (English / Spanish).

![Tech Stack](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5-f97316?style=flat)

## Features

### Timer
- **Focus sessions** with configurable durations (work, short break, long break)
- **Circular progress ring** with smooth animations
- **Audio notification** (triple beep) when a session completes
- **Auto-transition** between work and break modes

### Task Board (Kanban)
- **Three columns**: To Do, In Progress, Done
- **Add, move, and remove** tasks with a single click
- **Set active task** to track which pomodoros belong to each task
- **Persistent storage** — tasks survive page reloads via localStorage

### Session History
- **Track all completed sessions** with timestamp and duration
- **Stats dashboard** showing total sessions and focus time
- **Linked to tasks** — see which task each pomodoro was spent on
- **Clear history** option

### Settings
- **Customize durations** for focus, short break, and long break
- **Dark / Light mode** toggle with smooth transitions
- **Language switcher** — English and Spanish (EN / ES)
- All settings **persisted in localStorage**

### Design
- **Monochrome palette** — grayscale tones for a clean, professional look
- **Glassmorphism** panels with backdrop blur
- **Responsive layout** — works on mobile and desktop
- **Smooth animations** — fade-in, slide-down transitions

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| State management | Zustand |
| Icons | Tabler Icons |
| Persistence | localStorage |
| Audio | Web Audio API |

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/sebahernandez/pomo-for-students.git
cd pomo-for-students

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Card.tsx           # Task card component
│   ├── Footer.tsx         # App footer
│   ├── Header.tsx         # App header with controls
│   ├── KanbanBoard.tsx    # Task board with columns
│   ├── Logo.tsx           # Brand logo
│   ├── SessionHistory.tsx # Session history modal
│   ├── SettingsPanel.tsx  # Settings modal
│   └── TimerCard.tsx      # Pomodoro timer with progress ring
├── context/
│   └── AppContext.tsx     # Zustand store (state + actions)
├── i18n/
│   └── translations.ts    # EN/ES translations
├── App.tsx                # Main layout
├── main.tsx               # Entry point
└── index.css              # Global styles + design tokens
```

## Usage

1. **Start a focus session** — Click the timer mode (Focus / Short Break / Long Break), then press **Start**
2. **Add tasks** — Type a task name in the input field and click **Add**
3. **Focus on a task** — Click the **◎ Focus** button on any task card, or select it from the dropdown in the timer
4. **Move tasks** — Use the action buttons on each card to progress through columns
5. **View history** — Click the chart icon in the header to see completed sessions
6. **Customize** — Click the gear icon to adjust durations
7. **Switch language** — Click the language button (EN/ES) in the header
8. **Toggle dark mode** — Click the moon/sun icon

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Start / Pause | Space (when timer is focused) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT — See [LICENSE](LICENSE) for details.
