import type { PlainDate } from '@astryx-vue/core'
import { describe, expect, it } from 'vitest'
import { getInitialTimeGridOffset } from './timeGridScroll.js'

const SCROLL_HEIGHT = 2483
const days: PlainDate[] = [
  { year: 2026, month: 5, day: 10 },
  { year: 2026, month: 5, day: 11 },
  { year: 2026, month: 5, day: 12 },
  { year: 2026, month: 5, day: 13 },
]
const geometry = {
  timezoneID: 'UTC',
  minHour: 0,
  hourHeight: 100,
  scrollHeight: SCROLL_HEIGHT,
  clientHeight: 600,
}

describe('getInitialTimeGridOffset', () => {
  it('opens one hour above now when today is in the range', () => {
    expect(getInitialTimeGridOffset({
      ...geometry,
      currentTime: Date.UTC(2026, 4, 13, 14, 0),
      days,
    })).toBe(1302)
  })

  it('opens at the top when today is not in the range', () => {
    expect(getInitialTimeGridOffset({
      ...geometry,
      currentTime: Date.UTC(2026, 6, 1, 14, 0),
      days,
    })).toBe(0)
  })

  it('clamps to the top shortly after the window starts', () => {
    expect(getInitialTimeGridOffset({
      ...geometry,
      currentTime: Date.UTC(2026, 4, 13, 0, 20),
      days,
    })).toBe(0)
  })

  it('clamps to the end of the grid near midnight', () => {
    expect(getInitialTimeGridOffset({
      ...geometry,
      currentTime: Date.UTC(2026, 4, 13, 23, 50),
      days,
    })).toBe(SCROLL_HEIGHT - 600)
  })

  it('measures from the configured first hour', () => {
    expect(getInitialTimeGridOffset({
      ...geometry,
      minHour: 7,
      currentTime: Date.UTC(2026, 4, 13, 9, 0),
      days,
    })).toBe(102)
  })
})
