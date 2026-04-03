import { IconBrandGithub, IconHeart } from '@tabler/icons-react'

const VERSION = '1.0.0'

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto max-w-7xl px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              pomodoro for students, by Kreadium.cl
            </span>
            <span className="text-xs text-neutral-300 dark:text-neutral-600">© 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 font-mono">
              v{VERSION}
            </span>
            <a
              href="https://github.com/sebahernandez/pomo-for-students"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              title="View on GitHub"
            >
              <IconBrandGithub size={16} />
            </a>
            <span className="text-[0.6rem] text-neutral-300 dark:text-neutral-600 inline-flex items-center gap-0.5">
              Made with <IconHeart size={10} className="text-neutral-400 dark:text-neutral-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
