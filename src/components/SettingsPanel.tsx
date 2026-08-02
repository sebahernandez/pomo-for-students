import { useState, type ReactNode } from 'react'
import { IconSettings, IconClock, IconCoffee } from '@tabler/icons-react'
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
  { key: 'break', min: 1, max: 60, icon: <IconCoffee size={12} />, label: (t) => t.breakMin },
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
  const { settings, updateSettings, language, theme, setTheme } = useAppStore()
  const t = useTranslations(language)
  const [form, setForm] = useState<FormState>(() => toFormState(settings))
  const [showWarning, setShowWarning] = useState(false)
  // Theme applies as a live preview; remember the one active when the panel
  // opened so a theme change counts as unsaved and Cancel can revert it.
  const [baselineTheme] = useState(theme)

  // There are unsaved changes when any field differs from the persisted config
  // or the theme has been changed since the panel opened.
  const isDirty =
    FIELDS.some(({ key }) => form[key] !== String(settings[key])) || theme !== baselineTheme

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = FIELDS.reduce((acc, { key, min, max }) => {
      acc[key] = normalize(form[key], min, max, settings[key])
      return acc
    }, {} as Settings)
    updateSettings(normalized)
    // Reflect the persisted, normalized values back into the inputs, then close
    // the drawer to confirm the save completed. The previewed theme is kept.
    setForm(toFormState(normalized))
    onClose()
  }

  // Cancel discards unsaved edits: revert the previewed theme to the baseline
  // before closing. Bypasses the unsaved-changes guard.
  const handleCancel = () => {
    if (theme !== baselineTheme) setTheme(baselineTheme)
    onClose()
  }

  // Guard the passive close mechanisms (scrim, Escape, X): with unsaved changes,
  // warn the user instead of discarding. Save and Cancel bypass this guard.
  const attemptClose = () => {
    if (isDirty) {
      setShowWarning(true)
      return
    }
    onClose()
  }

  return (
    <Drawer
      onClose={attemptClose}
      title={t.settings}
      icon={<IconSettings size={20} className="text-theme-muted" />}
      maxWidthClass="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
        {FIELDS.map(({ key, icon, label }) => (
          <div key={key}>
            <label htmlFor={`setting-${key}`} className="block text-xs font-medium text-theme-muted mb-1.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              {icon} {label(t)}
            </label>
            <input
              id={`setting-${key}`}
              type="text"
              inputMode="numeric"
              value={form[key]}
              onChange={(e) => {
                setShowWarning(false)
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
              }}
              className="input-glass"
            />
          </div>
        ))}
        <ThemeSelector />
        {showWarning && (
          <p role="alert" className="text-xs text-amber-600 dark:text-amber-400">
            {t.unsavedChanges}
          </p>
        )}
        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary flex-1">
            {t.save}
          </button>
          <button type="button" onClick={handleCancel} className="btn-secondary flex-1">
            {t.cancel}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
