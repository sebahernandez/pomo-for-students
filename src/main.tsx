import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
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
    <Header />
      <App />
    <Footer />
  </StrictMode>,
)
