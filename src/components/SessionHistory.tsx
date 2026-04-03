import { IconX, IconClock, IconTrophy, IconFlame, IconTrash, IconHourglass } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

interface SessionHistoryProps {
  onClose: () => void
}

export function SessionHistory({ onClose }: SessionHistoryProps) {
  const { sessionHistory, clearHistory, language } = useAppStore()
  const t = useTranslations(language)

  const totalPomodoros = sessionHistory.length
  const totalMinutes = sessionHistory.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="modal-glass w-full max-w-md animate-slide-down flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 inline-flex items-center gap-2">
              <IconClock size={20} className="text-neutral-500 dark:text-neutral-400" />
              {t.sessionHistory}
            </h2>
            <button onClick={onClose} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              <IconX size={20} />
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-lg px-4 py-2.5 flex-1 text-center">
              <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300 inline-flex items-center gap-1.5 justify-center">
                <IconFlame size={16} /> {totalPomodoros}
              </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{t.sessions}</div>
            </div>
            <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-lg px-4 py-2.5 flex-1 text-center">
              <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300 inline-flex items-center gap-1.5 justify-center">
                <IconHourglass size={16} /> {Math.round(totalMinutes / 60 * 10) / 10}h
              </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{t.focusTimeLabel}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
            {sessionHistory.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <IconTrophy size={32} className="text-neutral-200 dark:text-neutral-700 mx-auto mb-2" />
                  <p className="text-neutral-400 dark:text-neutral-500 text-sm">{t.noSessionsYet}</p>
                  <p className="text-neutral-300 dark:text-neutral-600 text-xs mt-1">{t.startTimerToTrack}</p>
                </div>
              </div>
            )}
            {[...sessionHistory].reverse().map((session) => (
              <div key={session.id} className="bg-black/[0.02] dark:bg-white/[0.02] rounded-lg p-3 border border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconFlame size={14} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {session.taskTitle ?? t.freeFocus}
                    </span>
                  </div>
                  <span className="text-neutral-400 dark:text-neutral-500 text-xs whitespace-nowrap">
                    {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{session.duration} min</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearHistory}
              disabled={sessionHistory.length === 0}
              className="btn-danger flex-1 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
            >
              <IconTrash size={14} /> {t.clear}
            </button>
            <button onClick={onClose} className="btn-secondary flex-1">
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
