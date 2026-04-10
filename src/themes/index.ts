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
    accentGlow: 'rgba(17, 24, 39, 0.1)',
    gradientStart: '#fafaf9',
    gradientMid: '#f5f5f4',
    gradientEnd: '#f0efee',
    glassBg: 'rgba(255, 255, 255, 0.95)',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0f4c75',
    primaryHover: '#165d91',
    secondary: '#3282b8',
    accent: '#bbe1fa',
    accentGlow: 'rgba(59, 130, 246, 0.15)',
    gradientStart: '#f0f9ff',
    gradientMid: '#e0f2fe',
    gradientEnd: '#bae6fd',
    glassBg: 'rgba(240, 249, 255, 0.92)',
  },
  forest: {
    name: 'Forest',
    primary: '#1b4332',
    primaryHover: '#2d6a4f',
    secondary: '#40916c',
    accent: '#74c69d',
    accentGlow: 'rgba(16, 185, 129, 0.15)',
    gradientStart: '#f0fdf4',
    gradientMid: '#dcfce7',
    gradientEnd: '#bbf7d0',
    glassBg: 'rgba(240, 253, 244, 0.92)',
  },
  sunset: {
    name: 'Sunset',
    primary: '#9a3412',
    primaryHover: '#c2410c',
    secondary: '#ea580c',
    accent: '#fdba74',
    accentGlow: 'rgba(249, 115, 22, 0.15)',
    gradientStart: '#fff7ed',
    gradientMid: '#ffedd5',
    gradientEnd: '#fed7aa',
    glassBg: 'rgba(255, 247, 237, 0.92)',
  },
  rose: {
    name: 'Rose',
    primary: '#881337',
    primaryHover: '#a21c3e',
    secondary: '#e11d48',
    accent: '#fda4af',
    accentGlow: 'rgba(244, 63, 94, 0.15)',
    gradientStart: '#fff1f2',
    gradientMid: '#ffe4e6',
    gradientEnd: '#fecdd3',
    glassBg: 'rgba(255, 241, 242, 0.92)',
  },
  midnight: {
    name: 'Midnight',
    primary: '#6366f1',
    primaryHover: '#818cf8',
    secondary: '#a5b4fc',
    accent: '#c7d2fe',
    accentGlow: 'rgba(99, 102, 241, 0.2)',
    gradientStart: '#eef2ff',
    gradientMid: '#e0e7ff',
    gradientEnd: '#c7d2fe',
    glassBg: 'rgba(238, 242, 255, 0.92)',
  },
}

export const darkThemes: Record<ThemeName, ThemeColors> = {
  neutral: {
    name: 'Neutral',
    primary: '#e5e5e5',
    primaryHover: '#ffffff',
    secondary: '#a3a3a3',
    accent: '#fafafa',
    accentGlow: 'rgba(255, 255, 255, 0.05)',
    gradientStart: '#0c0a09',
    gradientMid: '#0a0908',
    gradientEnd: '#080706',
    glassBg: 'rgba(12, 10, 9, 0.95)',
  },
  ocean: {
    name: 'Ocean',
    primary: '#7dd3fc',
    primaryHover: '#bae6fd',
    secondary: '#38bdf8',
    accent: '#0ea5e9',
    accentGlow: 'rgba(56, 189, 248, 0.2)',
    gradientStart: '#0c1929',
    gradientMid: '#0f2744',
    gradientEnd: '#0c2d4f',
    glassBg: 'rgba(12, 25, 41, 0.95)',
  },
  forest: {
    name: 'Forest',
    primary: '#86efac',
    primaryHover: '#bbf7d0',
    secondary: '#4ade80',
    accent: '#22c55e',
    accentGlow: 'rgba(34, 197, 94, 0.2)',
    gradientStart: '#031a0e',
    gradientMid: '#052b1f',
    gradientEnd: '#063525',
    glassBg: 'rgba(3, 26, 14, 0.95)',
  },
  sunset: {
    name: 'Sunset',
    primary: '#fdba74',
    primaryHover: '#fed7aa',
    secondary: '#fb923c',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.2)',
    gradientStart: '#1a0a02',
    gradientMid: '#2a1007',
    gradientEnd: '#3a150c',
    glassBg: 'rgba(26, 10, 2, 0.95)',
  },
  rose: {
    name: 'Rose',
    primary: '#fda4af',
    primaryHover: '#fecdd3',
    secondary: '#fb7185',
    accent: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.2)',
    gradientStart: '#1f0509',
    gradientMid: '#2f0a0f',
    gradientEnd: '#3f0f15',
    glassBg: 'rgba(31, 5, 9, 0.95)',
  },
  midnight: {
    name: 'Midnight',
    primary: '#a5b4fc',
    primaryHover: '#c7d2fe',
    secondary: '#818cf8',
    accent: '#6366f1',
    accentGlow: 'rgba(99, 102, 241, 0.25)',
    gradientStart: '#0a0a1a',
    gradientMid: '#12122a',
    gradientEnd: '#1a1a3a',
    glassBg: 'rgba(10, 10, 26, 0.95)',
  },
}