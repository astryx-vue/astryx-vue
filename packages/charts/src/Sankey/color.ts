import type { SankeyColor } from './types.js'

export function clampUnit(value: number, fallback: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback
}

export function sankeyOklch(color: SankeyColor, alpha: number): string {
  return `oklch(${color[0]} ${color[1]} ${color[2]} / ${alpha})`
}

export function sankeyOnSurfaceColor(color: SankeyColor, cssOverride?: string): string {
  if (cssOverride) {
    const value = cssOverride.toLowerCase().trim()
    const isDark = value === 'black'
      || /^#[0-3]/.test(value)
      || /^#.[0-3]/.test(value)
      || /^rgb\(\s*[0-7]\d?\s*,/.test(value)
    return isDark ? 'var(--astryx-color-on-dark, #fff)' : 'var(--astryx-color-on-light, #000)'
  }
  return color[0] < 0.6 ? 'var(--astryx-color-on-dark, #fff)' : 'var(--astryx-color-on-light, #000)'
}
