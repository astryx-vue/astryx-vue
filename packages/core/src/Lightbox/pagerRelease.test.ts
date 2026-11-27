/**
 * @file pagerRelease.test.ts
 * @input vitest、翻页的松手规则和拖动位置
 * @output 按 UIKit 实测（402pt 页面）核对选页：最近页、轻扫速度、最多一页、往回的松手回到起点；
 *   以及拖动时越过两端的橡皮筋和触控板的一页窗口
 * @position 测试；不需要浏览器的 pagerRelease.ts
 */

import { describe, expect, it } from 'vitest'
import { rubberBand } from '../motion/rubberBand'
import { dragTrackPosition, pageForRelease } from './pagerRelease'

describe('pageForRelease: UIKit\'s measured page choices (402 pt pages)', () => {
  const PAGE = 402
  const page = (fraction: number, velocity: number, startIndex = 1): number =>
    pageForRelease({ position: (startIndex + fraction) * PAGE, velocity, stride: PAGE, count: 6, startIndex })

  it('released at rest, settles on the nearest page', () => {
    expect(page(0.485, 0)).toBe(1)
    expect(page(0.575, 0)).toBe(2)
    expect(page(-0.485, 0)).toBe(1)
    expect(page(-0.575, 0)).toBe(0)
  })

  it('pages with the velocity at the advance speed, from wherever the content is', () => {
    for (const fraction of [0.1, 0.25, 0.4]) {
      expect(page(fraction, 298.6)).toBe(1)
      expect(page(fraction, 310.7)).toBe(2)
      expect(page(-fraction, -298.6)).toBe(1)
      expect(page(-fraction, -310.7)).toBe(0)
    }
    expect(page(0.06, 600)).toBe(2)
    expect(page(0.46, 150)).toBe(1)
  })

  it('never travels more than one page from the page the drag started on', () => {
    expect(page(1.5, 0)).toBe(2)
    expect(page(1.5, 3000)).toBe(2)
    expect(page(0.7, 1200)).toBe(2)
  })

  it('a release whose velocity points back toward the start page cancels, whatever the travel', () => {
    expect(page(0.4, -600)).toBe(1)
    expect(page(0.95, -299)).toBe(1)
    expect(page(-0.95, 299)).toBe(1)
    expect(page(0.7, 50)).toBe(2)
  })

  it('clamps to the pages, and handles degenerate geometry', () => {
    expect(page(0.3, 600, 5)).toBe(5)
    expect(page(-0.3, -600, 0)).toBe(0)
    expect(pageForRelease({ position: 400, velocity: -1000, stride: 100, count: 5, startIndex: 7 })).toBe(3)
    expect(pageForRelease({ position: 10, velocity: 0, stride: 0, count: 3, startIndex: 0 })).toBe(0)
    expect(pageForRelease({ position: 10, velocity: 0, stride: 100, count: 1, startIndex: 0 })).toBe(0)
  })
})

describe('dragTrackPosition', () => {
  const base = { stride: 440, count: 3, pageWidth: 400 }

  it('follows the finger 1:1 between the first and the last page', () => {
    expect(dragTrackPosition({ ...base, start: 440, delta: 120 })).toBe(560)
    expect(dragTrackPosition({ ...base, start: 440, delta: -440 })).toBe(0)
  })

  it('rubber-bands past either end with d = the page width', () => {
    expect(dragTrackPosition({ ...base, start: 0, delta: -100 })).toBeCloseTo(rubberBand(-100, 400), 9)
    expect(dragTrackPosition({ ...base, start: 880, delta: 60 })).toBeCloseTo(880 + rubberBand(60, 400), 9)
    expect(Math.abs(dragTrackPosition({ ...base, start: 0, delta: -100 }))).toBeLessThan(100)
  })

  it('holds a trackpad swipe within one page of its start page', () => {
    expect(dragTrackPosition({ ...base, start: 0, delta: 1500, startIndex: 0 })).toBe(440)
    expect(dragTrackPosition({ ...base, start: 440, delta: -1500, startIndex: 1 })).toBe(0)
  })
})
