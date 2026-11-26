/** 速度菜单列出的、`<` `>` 快捷键逐档切换的播放速度。 */
export const DEFAULT_PLAYBACK_RATES: readonly number[] = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** 把秒数写成 m:ss；`hasHours` 为真或超过一小时时写成 h:mm:ss。 */
export function formatClock(seconds: number, hasHours = false): string {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  if (hasHours || hours > 0)
    return `${hours}:${pad(minutes)}:${pad(rest)}`
  return `${minutes}:${pad(rest)}`
}

interface DurationFormatConstructor {
  new (locale: string, options: { style: 'long', secondsDisplay?: 'always' | 'auto' }): {
    format: (duration: { hours?: number, minutes?: number, seconds?: number }) => string
  }
}

/**
 * 把秒数写成给读屏软件念的话，比如「1 分钟 5 秒」。
 * 浏览器没有 `Intl.DurationFormat` 时退回 m:ss 的写法。
 */
export function formatSpokenTime(seconds: number, locale: string): string {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const DurationFormat = (Intl as unknown as { DurationFormat?: DurationFormatConstructor }).DurationFormat
  if (DurationFormat == null)
    return formatClock(total)
  try {
    // DurationFormat 会省掉为零的单位，0 秒得强制显示秒。
    if (total === 0)
      return new DurationFormat(locale, { style: 'long', secondsDisplay: 'always' }).format({ seconds: 0 })
    return new DurationFormat(locale, { style: 'long' }).format({
      hours: Math.floor(total / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    })
  }
  catch {
    return formatClock(total)
  }
}

/** 速度的数字写法，最多两位小数，比如 1.25。 */
export function formatRate(rate: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(rate)
}
