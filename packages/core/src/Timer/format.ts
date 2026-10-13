export type TimerFormat = 'elapsed' | 'clock'

const ONE_SECOND_MS = 1000
const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
const ONE_HOUR_SECONDS = 60 * 60
const MAX_TIMEOUT_MS = 2_147_483_647

export interface TimerPresentation {
  dateTime: string
  text: string
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function resolveTimerFormat(format: TimerFormat | undefined): TimerFormat {
  return format === 'clock' ? 'clock' : 'elapsed'
}

export function getElapsedMilliseconds(now: number, startTime: number): number {
  return Math.max(0, now - startTime)
}

export function getPresentation(elapsedMilliseconds: number, format: TimerFormat): TimerPresentation {
  const elapsedSeconds = Math.floor(elapsedMilliseconds / ONE_SECOND_MS)

  if (format === 'clock') {
    const hours = Math.floor(elapsedSeconds / ONE_HOUR_SECONDS)
    const minutes = Math.floor((elapsedSeconds % ONE_HOUR_SECONDS) / 60)
    const seconds = elapsedSeconds % 60
    return {
      dateTime: `PT${elapsedSeconds}S`,
      text: hours > 0
        ? `${String(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${String(minutes)}:${pad(seconds)}`,
    }
  }

  if (elapsedSeconds < 60) {
    return { dateTime: `PT${elapsedSeconds}S`, text: `${String(elapsedSeconds)}s` }
  }

  const totalMinutes = Math.floor(elapsedSeconds / 60)
  if (totalMinutes < 60) {
    return {
      dateTime: `PT${elapsedSeconds}S`,
      text: `${String(totalMinutes)}m ${pad(elapsedSeconds % 60)}s`,
    }
  }

  const representedSeconds = totalMinutes * 60
  return {
    dateTime: `PT${representedSeconds}S`,
    text: `${String(Math.floor(totalMinutes / 60))}h ${pad(totalMinutes % 60)}m`,
  }
}

export function getMillisecondsUntilNextChange(
  now: number,
  startTime: number,
  elapsedMilliseconds: number,
  format: TimerFormat,
): number {
  if (now < startTime)
    return Math.min(startTime - now + ONE_SECOND_MS, MAX_TIMEOUT_MS)

  const precision = format === 'elapsed' && elapsedMilliseconds >= ONE_HOUR_SECONDS * ONE_SECOND_MS
    ? ONE_MINUTE_MS
    : ONE_SECOND_MS
  return precision - (elapsedMilliseconds % precision)
}
