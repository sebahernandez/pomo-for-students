import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { OnboardingWizard } from './components/OnboardingWizard.tsx'
import { CookieConsentBanner } from './components/CookieConsentBanner.tsx'
import { useAppStore } from './context/AppContext.tsx'

function DarkModeInit() {
  const darkMode = useAppStore((s) => s.darkMode)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkModeInit />
    <OnboardingWizard />
    <CookieConsentBanner />
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <App />
      </main>
      <Footer />
    </div>
  </StrictMode>,
)
