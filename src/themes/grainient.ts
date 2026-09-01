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
      color2: '#e7e5e4',
      color3: '#d6d3d1',
      lightMode: false,
      contrast: 1.1,
      saturation: 0.95,
      warpFrequency: 3.5,
      warpAmplitude: 65,
      rotationAmount: 320,
      timeSpeed: 0.16,
      grainAmount: 0.05,
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
      color1: '#e0f2fe',
      color2: '#bae6fd',
      color3: '#93c5fd',
      lightMode: false,
      contrast: 1.15,
      saturation: 1.0,
      grainAmount: 0.05,
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
      color1: '#dcfce7',
      color2: '#bbf7d0',
      color3: '#86efac',
      lightMode: false,
      contrast: 1.15,
      saturation: 1.0,
      grainAmount: 0.05,
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
      color1: '#ffedd5',
      color2: '#fed7aa',
      color3: '#fdba74',
      lightMode: false,
      contrast: 1.15,
      saturation: 1.0,
      grainAmount: 0.05,
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
      color1: '#ffe4e6',
      color2: '#fecdd3',
      color3: '#fda4af',
      lightMode: false,
      contrast: 1.15,
      saturation: 1.0,
      grainAmount: 0.05,
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
      color1: '#e0e7ff',
      color2: '#c7d2fe',
      color3: '#a5b4fc',
      lightMode: false,
      contrast: 1.15,
      saturation: 1.0,
      grainAmount: 0.05,
      warpFrequency: 6.5,
      warpSpeed: 1.8,
      timeSpeed: 0.2,
      rotationAmount: 600,
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
