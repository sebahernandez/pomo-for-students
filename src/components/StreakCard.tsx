import { useState } from 'react'
import { IconFlame, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { weekView, todayCount, DAILY_GOAL } from '../lib/streak'

// Etiqueta corta del día ('lun', 'mon', ...) derivada de la fecha según el
// idioma activo, para no mantener 7 traducciones por idioma a mano.
const dayLabel = (dateKey: string, language: string) => {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d, 12, 0, 0)
  const label = new Intl.DateTimeFormat(language, { weekday: 'short' }).format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function StreakCard() {
  const streak = useAppStore((s) => s.streak)
  const language = useAppStore((s) => s.language)
  const t = useTranslations(language)
  // La semana se ancla al momento de montaje (el panel es efímero); evita
  // llamar a una función impura durante el render.
  const [now] = useState(() => Date.now())
  const days = weekView(streak, now)
  const doneToday = Math.min(todayCount(streak, now), DAILY_GOAL)
  const progressPct = Math.round((doneToday / DAILY_GOAL) * 100)

  return (
    <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-theme-accent-soft text-theme-accent flex-shrink-0">
          <IconFlame size={24} />
        </div>
        <div className="leading-tight">
          <div className="text-xs text-theme-muted uppercase tracking-wider">{t.streak}</div>
          <div className="text-2xl font-bold text-theme-secondary">
            {streak.currentStreak}{' '}
            <span className="text-sm font-medium text-theme-muted uppercase tracking-wider">
              {t.days}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-theme-muted uppercase tracking-wider">{t.today}</span>
          <span className="text-xs font-medium text-theme-secondary tabular-nums">
            {doneToday}<span className="text-theme-muted">/{DAILY_GOAL}</span>
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full bg-theme-accent transition-[width]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between gap-1">
        {days.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                day.done
                  ? 'bg-theme-accent text-theme-on-accent'
                  : day.isToday
                    ? 'border-2 border-theme-accent'
                    : 'bg-black/[0.05] dark:bg-white/[0.06]',
              ].join(' ')}
            >
              {day.done && <IconCheck size={16} strokeWidth={3} />}
            </div>
            <span
              className={[
                'text-[10px] uppercase tracking-wide',
                day.isToday ? 'text-theme-secondary font-semibold' : 'text-theme-muted',
              ].join(' ')}
            >
              {dayLabel(day.date, language)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
