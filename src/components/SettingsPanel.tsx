import { useState } from 'react'
import { IconX, IconSettings, IconClock, IconCoffee, IconBeach } from '@tabler/icons-react'
import { useAppStore, type Settings } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { ThemeSelector } from './ThemeSelector'

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSettings, language } = useAppStore()
  const t = useTranslations(language)
  const [form, setForm] = useState<Settings>({ ...settings })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(form)
    onClose()
  }

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="modal-glass w-full max-w-sm animate-slide-down" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 inline-flex items-center gap-2">
              <IconSettings size={20} className="text-neutral-500 dark:text-neutral-400" />
              {t.settings}
            </h2>
            <button onClick={onClose} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              <IconX size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider inline-flex items-center gap-1.5">
                <IconClock size={12} /> {t.focusMin}
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={form.work}
                onChange={(e) => setForm({ ...form, work: Number(e.target.value) })}
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider inline-flex items-center gap-1.5">
                <IconCoffee size={12} /> {t.shortBreakMin}
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={form.shortBreak}
                onChange={(e) => setForm({ ...form, shortBreak: Number(e.target.value) })}
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider inline-flex items-center gap-1.5">
                <IconBeach size={12} /> {t.longBreakMin}
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={form.longBreak}
                onChange={(e) => setForm({ ...form, longBreak: Number(e.target.value) })}
                className="input-glass"
              />
            </div>
            <ThemeSelector />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary flex-1">
                {t.save}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
