import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { OnboardingWizard } from './components/OnboardingWizard.tsx'
import { CookieConsentBanner } from './components/CookieConsentBanner.tsx'
import { ThemedBackdrop } from './components/ThemedBackdrop.tsx'
import { DarkModeInit } from './components/DarkModeInit.tsx'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkModeInit />
    <Analytics />
    <ThemedBackdrop />
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
