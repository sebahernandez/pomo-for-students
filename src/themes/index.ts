export type ThemeName = 'neutral' | 'ocean' | 'forest' | 'sunset' | 'rose' | 'midnight'

export interface ThemeColors {
  name: string
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  accentGlow: string
  gradientStart: string
  gradientMid: string
  gradientEnd: string
  glassBg: string
}

export const themes: Record<ThemeName, ThemeColors> = {
  neutral: {
    name: 'Neutral',
    primary: '#111827',
    primaryHover: '#1f2937',
    secondary: '#6b7280',
    accent: '#111827',
    accentGlow: 'rgba(17, 24, 39, 0.03)',
    gradientStart: '#fafaf9',
    gradientMid: '#fafafa',
    gradientEnd: '#f8f8f8',
    glassBg: 'rgba(255, 255, 255, 0.97)',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0f4c75',
    primaryHover: '#165d91',
    secondary: '#3282b8',
    accent: '#bbe1fa',
    accentGlow: 'rgba(14, 165, 233, 0.03)',
    gradientStart: '#f0f9ff',
    gradientMid: '#f5faff',
    gradientEnd: '#f8fcff',
    glassBg: 'rgba(255, 255, 255, 0.97)',
  },
  forest: {
    name: 'Forest',
    primary: '#1b4332',
    primaryHover: '#2d6a4f',
    secondary: '#40916c',
    accent: '#74c69d',
    accentGlow: 'rgba(34, 197, 94, 0.03)',
    gradientStart: '#f0fdf4',
    gradientMid: '#f5fdf7',
    gradientEnd: '#f8fff9',
    glassBg: 'rgba(255, 255, 255, 0.97)',
  },
  sunset: {
    name: 'Sunset',
    primary: '#9a3412',
    primaryHover: '#c2410c',
    secondary: '#ea580c',
    accent: '#fdba74',
    accentGlow: 'rgba(249, 115, 22, 0.03)',
    gradientStart: '#fff7ed',
    gradientMid: '#fffaf5',
    gradientEnd: '#fff8f3',
    glassBg: 'rgba(255, 255, 255, 0.97)',
  },
  rose: {
    name: 'Rose',
    primary: '#881337',
    primaryHover: '#a21c3e',
    secondary: '#e11d48',
    accent: '#fda4af',
    accentGlow: 'rgba(244, 63, 94, 0.03)',
    gradientStart: '#fff1f2',
    gradientMid: '#fff5f6',
    gradientEnd: '#fff8f9',
    glassBg: 'rgba(255, 255, 255, 0.97)',
  },
  midnight: {
    name: 'Midnight',
    primary: '#6366f1',
    primaryHover: '#818cf8',
    secondary: '#a5b4fc',
    accent: '#c7d2fe',
    accentGlow: 'rgba(99, 102, 241, 0.03)',
    gradientStart: '#eef2ff',
    gradientMid: '#f5f6fd',
    gradientEnd: '#f8f9ff',
    glassBg: 'rgba(255, 255, 255, 0.97)',
  },
}

export const darkThemes: Record<ThemeName, ThemeColors> = {
  neutral: {
    name: 'Neutral',
    primary: '#e5e5e5',
    primaryHover: '#ffffff',
    secondary: '#a3a3a3',
    accent: '#fafafa',
    accentGlow: 'rgba(255, 255, 255, 0.03)',
    gradientStart: '#0c0a09',
    gradientMid: '#0d0c0b',
    gradientEnd: '#0e0d0c',
    glassBg: 'rgba(12, 12, 12, 0.97)',
  },
  ocean: {
    name: 'Ocean',
    primary: '#7dd3fc',
    primaryHover: '#bae6fd',
    secondary: '#38bdf8',
    accent: '#0ea5e9',
    accentGlow: 'rgba(56, 189, 248, 0.03)',
    gradientStart: '#0c1929',
    gradientMid: '#0e1c2e',
    gradientEnd: '#102030',
    glassBg: 'rgba(10, 20, 35, 0.97)',
  },
  forest: {
    name: 'Forest',
    primary: '#86efac',
    primaryHover: '#bbf7d0',
    secondary: '#4ade80',
    accent: '#22c55e',
    accentGlow: 'rgba(34, 197, 94, 0.03)',
    gradientStart: '#031a0e',
    gradientMid: '#042113',
    gradientEnd: '#052618',
    glassBg: 'rgba(5, 30, 15, 0.97)',
  },
  sunset: {
    name: 'Sunset',
    primary: '#fdba74',
    primaryHover: '#fed7aa',
    secondary: '#fb923c',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.03)',
    gradientStart: '#1a0a02',
    gradientMid: '#1e0d05',
    gradientEnd: '#221008',
    glassBg: 'rgba(25, 10, 2, 0.97)',
  },
  rose: {
    name: 'Rose',
    primary: '#fda4af',
    primaryHover: '#fecdd3',
    secondary: '#fb7185',
    accent: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.03)',
    gradientStart: '#1f0509',
    gradientMid: '#23080d',
    gradientEnd: '#270b11',
    glassBg: 'rgba(28, 5, 10, 0.97)',
  },
  midnight: {
    name: 'Midnight',
    primary: '#a5b4fc',
    primaryHover: '#c7d2fe',
    secondary: '#818cf8',
    accent: '#6366f1',
    accentGlow: 'rgba(99, 102, 241, 0.03)',
    gradientStart: '#0a0a1a',
    gradientMid: '#0e0e22',
    gradientEnd: '#12122a',
    glassBg: 'rgba(12, 12, 28, 0.97)',
  },
}