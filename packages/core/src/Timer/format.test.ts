import { describe, expect, it } from 'vitest'
import { getMillisecondsUntilNextChange, getPresentation } from './format.js'

describe('timer format', () => {
  it('writes elapsed durations in seconds, then minutes, then hours', () => {
    expect(getPresentation(4_200, 'elapsed')).toEqual({ dateTime: 'PT4S', text: '4s' })
    expect(getPresentation(75_900, 'elapsed')).toEqual({ dateTime: 'PT75S', text: '1m 15s' })
    expect(getPresentation(3_753_000, 'elapsed')).toEqual({ dateTime: 'PT3720S', text: '1h 02m' })
  })

  it('keeps clock readings second-precise past an hour', () => {
    expect(getPresentation(75_000, 'clock')).toEqual({ dateTime: 'PT75S', text: '1:15' })
    expect(getPresentation(3_753_000, 'clock')).toEqual({ dateTime: 'PT3753S', text: '1:02:33' })
  })

  it('waits until the next second, or the next minute after an hour of elapsed time', () => {
    expect(getMillisecondsUntilNextChange(1_500, 0, 1_500, 'elapsed')).toBe(500)
    expect(getMillisecondsUntilNextChange(3_600_400, 0, 3_600_400, 'elapsed')).toBe(59_600)
    expect(getMillisecondsUntilNextChange(3_600_400, 0, 3_600_400, 'clock')).toBe(600)
  })

  it('delays the first tick when the start time is still in the future', () => {
    expect(getMillisecondsUntilNextChange(1_000, 2_500, 0, 'elapsed')).toBe(2_500)
  })
})
