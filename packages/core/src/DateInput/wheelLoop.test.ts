/**
 * @file wheelLoop.test.ts
 * @input Positions on looping wheels of 60 minutes and 12 months
 * @output Holds the loop helpers to UIDatePicker's looping wheel: positions
 *   fold into rows, the nearest copy is the shorter way round, a rest turns
 *   the shorter way to an enabled row, a key crosses the seam, and the drawn
 *   span grows only when a motion needs it
 * @position Unit tests of wheelLoop.ts
 */

import { describe, expect, it } from 'vitest'
import { coveringSpan, DRAWN_PAST_BAND, lapPosition, loopedStep, mod, nearestLoopCopy, restingLoopStep, restingSpan } from './wheelLoop'

const everyRow = (): boolean => true

describe('positions on a loop', () => {
  it('fold into the rows, a lap at a time', () => {
    expect(mod(61, 60)).toBe(1)
    expect(mod(-1, 60)).toBe(59)
    expect(mod(-60, 60)).toBe(0)
  })

  it('name a row\'s copy nearest a position, the shorter way round', () => {
    // From :58, :02 is four rows on, past the seam: position 62.
    expect(nearestLoopCopy(2, 58, 60)).toBe(62)
    // From :02, :58 is four rows back: position −2.
    expect(nearestLoopCopy(58, 2, 60)).toBe(-2)
    expect(nearestLoopCopy(30, 20, 60)).toBe(30)
    // Half a lap away, the row itself: a step forward goes forward.
    expect(nearestLoopCopy(1, 0, 2)).toBe(1)
  })

  it('keep a row in the lap that holds a position', () => {
    expect(lapPosition(5, 61, 60)).toBe(65)
    expect(lapPosition(5, -3, 60)).toBe(-55)
    expect(lapPosition(5, 30, 60)).toBe(5)
  })
})

describe('a rest on a loop', () => {
  it('stays on an enabled row', () => {
    expect(restingLoopStep(everyRow, 61, 0, 60)).toBe(0)
  })

  it('turns the shorter way to the nearest enabled row, across the seam', () => {
    // Months with only January and February enabled: December turns on to January.
    const winter = (position: number): boolean => mod(position, 12) < 2
    expect(restingLoopStep(winter, 11, 1, 12)).toBe(1)
    expect(restingLoopStep(winter, 3, 1, 12)).toBe(-2)
  })

  it('breaks a tie toward the committed row, and with nothing near turns back to it', () => {
    const ends = (position: number): boolean => mod(position, 12) === 0 || mod(position, 12) === 2
    expect(restingLoopStep(ends, 1, 0, 12)).toBe(-1)
    expect(restingLoopStep(ends, 1, 2, 12)).toBe(1)
    expect(restingLoopStep(() => false, 5, 2, 12)).toBe(-3)
  })
})

describe('a key on a loop', () => {
  it('crosses the seam: ArrowDown on :59 moves one row on, to :00', () => {
    expect(loopedStep(everyRow, 59, 1, 60)).toBe(1)
    expect(loopedStep(everyRow, 0, -1, 60)).toBe(-1)
  })

  it('drops whole laps, so a key never turns a full turn', () => {
    expect(loopedStep(everyRow, 10, 60, 60)).toBeNull()
    expect(loopedStep(everyRow, 10, 61, 60)).toBe(1)
  })

  it('skips disabled rows in its own direction, half a turn at most, then looks back toward its start', () => {
    const only = (position: number): boolean => mod(position, 60) === 40
    expect(loopedStep(only, 59, -1, 60)).toBe(-19)
    // :40 is more than half a turn on, and nothing lies between: the key stays.
    expect(loopedStep(only, 59, 1, 60)).toBeNull()
    // Three rows on from :57 lands on :00; nothing is enabled for half a turn
    // past it, so the key takes :59, the enabled row nearest on the way back.
    const notFirstHalf = (position: number): boolean => mod(position, 60) >= 30
    expect(loopedStep(notFirstHalf, 57, 3, 60)).toBe(2)
    expect(loopedStep(() => false, 59, 1, 60)).toBeNull()
  })
})

describe('the drawn span', () => {
  it('rests on the wheel\'s rows and copies past each end', () => {
    expect(restingSpan(60)).toEqual({ from: -DRAWN_PAST_BAND, to: 59 + DRAWN_PAST_BAND })
  })

  it('grows to cover a motion and the band around it, and stays the same span when it already does', () => {
    const rest = restingSpan(60)
    expect(coveringSpan(rest, 30, 40)).toBe(rest)
    expect(coveringSpan(rest, 58, 90)).toEqual({ from: rest.from, to: 90 + DRAWN_PAST_BAND })
    expect(coveringSpan(rest, 2, -30)).toEqual({ from: -30 - DRAWN_PAST_BAND, to: rest.to })
  })
})
