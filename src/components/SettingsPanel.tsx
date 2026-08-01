import { useState, type ReactNode } from 'react'
import { IconSettings, IconClock, IconCoffee, IconBeach } from '@tabler/icons-react'
import { useAppStore, type Settings } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { ThemeSelector } from './ThemeSelector'
import { Drawer } from './Drawer'

interface SettingsPanelProps {
  onClose: () => void
}

type SettingKey = keyof Settings
type Translations = ReturnType<typeof useTranslations>

interface FieldConfig {
  key: SettingKey
  min: number
  max: number
  icon: ReactNode
  label: (t: Translations) => string
}

// Single source of truth for the numeric ranges, used to clamp values on save.
// Fields are plain text inputs (see below), so the browser performs no native
// number validation and this code fully owns parsing and range enforcement.
const FIELDS: FieldConfig[] = [
  { key: 'work', min: 1, max: 60, icon: <IconClock size={12} />, label: (t) => t.focusMin },
  { key: 'shortBreak', min: 1, max: 30, icon: <IconCoffee size={12} />, label: (t) => t.shortBreakMin },
  { key: 'longBreak', min: 1, max: 60, icon: <IconBeach size={12} />, label: (t) => t.longBreakMin },
]

type FormState = Record<SettingKey, string>

// Parse a raw text value to an integer and clamp it to [min, max].
// Falls back to the previously saved value when the input is empty or not a number.
const normalize = (value: string, min: number, max: number, fallback: number): number => {
  const parsed = parseInt(value, 10)
  if (Number.isNaN(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

const toFormState = (settings: Settings): FormState =>
  FIELDS.reduce((acc, { key }) => {
    acc[key] = String(settings[key])
    return acc
  }, {} as FormState)

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSettings, language } = useAppStore()
  const t = useTranslations(language)
  const [form, setForm] = useState<FormState>(() => toFormState(settings))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = FIELDS.reduce((acc, { key, min, max }) => {
      acc[key] = normalize(form[key], min, max, settings[key])
      return acc
    }, {} as Settings)
    updateSettings(normalized)
    // Reflect the persisted, normalized values back into the inputs.
    setForm(toFormState(normalized))
  }

  return (
    <Drawer
      onClose={onClose}
      title={t.settings}
      icon={<IconSettings size={20} className="text-neutral-500 dark:text-neutral-400" />}
      maxWidthClass="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
        {FIELDS.map(({ key, icon, label }) => (
          <div key={key}>
            <label htmlFor={`setting-${key}`} className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              {icon} {label(t)}
            </label>
            <input
              id={`setting-${key}`}
              type="text"
              inputMode="numeric"
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="input-glass"
            />
          </div>
        ))}
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
