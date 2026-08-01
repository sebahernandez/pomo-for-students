import { useState } from 'react'
import { IconSettings, IconClock, IconCoffee, IconBeach } from '@tabler/icons-react'
import { useAppStore, type Settings } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { ThemeSelector } from './ThemeSelector'
import { Drawer } from './Drawer'

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
  }

  return (
    <Drawer
      onClose={onClose}
      title={t.settings}
      icon={<IconSettings size={20} className="text-neutral-500 dark:text-neutral-400" />}
      maxWidthClass="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
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
    </Drawer>
  )
}
