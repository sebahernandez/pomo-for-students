import type { GrainientProps } from '../components/Grainient'
import type { ThemeName } from './index'

/**
 * Per-theme Grainient configurations (hand-tuned), replacing the old static CSS gradients.
 * Each theme has a `light` and `dark` variant. Colors are derived from the palettes in
 * `./index.ts` (primary/secondary/accent + gradient stops), then adjusted so each theme reads
 * as clearly distinct. `lightMode: true` softens the gradient toward white (keeps the near-opaque
 * `glass` cards legible in light mode); dark variants stay deep and saturated.
 *
 * Only the props worth tuning per theme are set here; everything else falls back to Grainient's
 * built-in defaults.
 */
export type GrainientConfig = Partial<GrainientProps>

export const grainientThemes: Record<ThemeName, { light: GrainientConfig; dark: GrainientConfig }> = {
  neutral: {
    light: {
      color1: '#f5f5f4',
      color2: '#d6d3d1',
      color3: '#a8a29e',
      lightMode: true,
      warpFrequency: 3.5,
      warpAmplitude: 65,
      rotationAmount: 320,
      timeSpeed: 0.16,
      grainAmount: 0.06,
      saturation: 0.9,
    },
    dark: {
      color1: '#3f3f46',
      color2: '#27272a',
      color3: '#09090b',
      lightMode: false,
      warpFrequency: 3.5,
      warpAmplitude: 65,
      rotationAmount: 320,
      timeSpeed: 0.16,
      grainAmount: 0.08,
      saturation: 0.9,
    },
  },
  ocean: {
    light: {
      color1: '#7dd3fc',
      color2: '#3282b8',
      color3: '#bbe1fa',
      lightMode: true,
      warpFrequency: 6,
      warpSpeed: 2.2,
      timeSpeed: 0.22,
      rotationAmount: 520,
    },
    dark: {
      color1: '#0c3d6b',
      color2: '#0f2744',
      color3: '#071525',
      lightMode: false,
      warpFrequency: 6,
      warpSpeed: 2.2,
      timeSpeed: 0.22,
      rotationAmount: 520,
    },
  },
  forest: {
    light: {
      color1: '#74c69d',
      color2: '#40916c',
      color3: '#1b4332',
      lightMode: true,
      warpFrequency: 4,
      warpAmplitude: 55,
      rotationAmount: 380,
      timeSpeed: 0.18,
    },
    dark: {
      color1: '#083d2b',
      color2: '#052b1f',
      color3: '#021509',
      lightMode: false,
      warpFrequency: 4,
      warpAmplitude: 55,
      rotationAmount: 380,
      timeSpeed: 0.18,
    },
  },
  sunset: {
    light: {
      color1: '#fdba74',
      color2: '#ea580c',
      color3: '#9a3412',
      lightMode: true,
      warpFrequency: 5,
      warpAmplitude: 60,
      warpSpeed: 2.4,
      timeSpeed: 0.3,
      rotationAmount: 560,
    },
    dark: {
      color1: '#3d160a',
      color2: '#2a1007',
      color3: '#1a0a02',
      lightMode: false,
      warpFrequency: 5,
      warpAmplitude: 60,
      warpSpeed: 2.4,
      timeSpeed: 0.3,
      rotationAmount: 560,
    },
  },
  rose: {
    light: {
      color1: '#fda4af',
      color2: '#e11d48',
      color3: '#881337',
      lightMode: true,
      warpFrequency: 4.5,
      warpAmplitude: 50,
      timeSpeed: 0.24,
      rotationAmount: 460,
    },
    dark: {
      color1: '#3f1018',
      color2: '#2f0a0f',
      color3: '#1f0509',
      lightMode: false,
      warpFrequency: 4.5,
      warpAmplitude: 50,
      timeSpeed: 0.24,
      rotationAmount: 460,
    },
  },
  midnight: {
    light: {
      color1: '#a5b4fc',
      color2: '#6366f1',
      color3: '#c7d2fe',
      lightMode: true,
      warpFrequency: 6.5,
      warpSpeed: 1.8,
      timeSpeed: 0.2,
      rotationAmount: 600,
      grainAmount: 0.08,
    },
    dark: {
      color1: '#1c1c3e',
      color2: '#12122a',
      color3: '#0a0a1a',
      lightMode: false,
      warpFrequency: 6.5,
      warpSpeed: 1.8,
      timeSpeed: 0.2,
      rotationAmount: 600,
      grainAmount: 0.1,
    },
  },
}
