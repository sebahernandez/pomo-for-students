import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

export function Footer() {
  const { language } = useAppStore()
  const t = useTranslations(language)

  return (
    <footer className="w-full py-4 px-6 mt-8">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          {t.footer}
        </p>
      </div>
    </footer>
  )
}
