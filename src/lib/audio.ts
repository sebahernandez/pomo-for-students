// lib/audio.ts

const playTone = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  vol: number
) => {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

// Un solo AudioContext compartido: los navegadores limitan los contextos
// simultáneos (~6) y crear uno por campanada sin cerrarlo los agota, dejando
// el sonido mudo. También puede no existir (jsdom, navegadores antiguos).
let sharedCtx: AudioContext | null = null

const getContext = (): AudioContext | null => {
  if (sharedCtx) return sharedCtx
  try {
    sharedCtx = new AudioContext()
    return sharedCtx
  } catch {
    return null
  }
}

export const playCompletionSound = () => {
  try {
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    const now = ctx.currentTime

    playTone(ctx, 523.25, now, 0.4, 0.4)
    playTone(ctx, 659.25, now + 0.15, 0.4, 0.4)
    playTone(ctx, 783.99, now + 0.3, 0.4, 0.4)
    playTone(ctx, 1046.5, now + 0.5, 0.6, 0.35)
    playTone(ctx, 783.99, now + 1.2, 0.4, 0.3)
    playTone(ctx, 1046.5, now + 1.4, 0.8, 0.35)
  } catch {
    // El sonido es un extra: nunca debe romper el fin de sesión.
  }
}
