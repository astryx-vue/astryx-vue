/**
 * @file zoomDismiss.test.ts
 * @input vitest、下拉关闭的几何和 UIKit 缩放常量
 * @output 按照片 App（iOS 26.2）实测核对下拉关闭：照片缩小、背景和控件变淡、松手规则、离场位置和弹簧数值
 * @position 测试；不需要浏览器的 zoomDismiss.ts
 */

import { describe, expect, it } from 'vitest'
import { zoomMedia } from '../motion/uikit/zoomMedia'
import { landscape, shown } from './__tests__/zoomGeometry'
import {
  dismissBackdropAlpha,
  dismissChromeAlpha,
  dismissCommits,
  dismissExitY,
  dismissTransform,
} from './zoomDismiss'

describe('the drag to dismiss of Photos (iOS 26.2)', () => {
  // Photos, a 3000 × 2000 photo at its fitted size dragged down: travel →
  // photo scale, backdrop alpha, neighbours' and controls' alpha.
  const measured = [
    { travel: 25, scale: 0.997, backdrop: 1.0, chrome: 0.96 },
    { travel: 65, scale: 0.978, backdrop: 0.95, chrome: 0.76 },
    { travel: 105, scale: 0.942, backdrop: 0.86, chrome: 0.52 },
    { travel: 145, scale: 0.899, backdrop: 0.71, chrome: 0.33 },
  ]

  it('shrinks the photo about its centre, which follows the finger', () => {
    const geometry = landscape()
    for (const row of measured) {
      const t = dismissTransform(geometry, 12, row.travel)
      expect(t.scale).toBeCloseTo(row.scale, 2)
      // The fitted box's centre moved by exactly the finger's travel.
      const centre = shown(geometry, t, 201, 134)
      expect(centre.x).toBeCloseTo(geometry.fit.x + 201 + 12, 6)
      expect(centre.y).toBeCloseTo(geometry.fit.y + 134 + row.travel, 6)
    }
    // Above where the drag started, the photo follows without shrinking.
    expect(dismissTransform(geometry, 0, -30)).toEqual({
      x: 0,
      y: -30,
      scale: 1,
    })
  })

  it('fades the backdrop and, faster, the controls', () => {
    for (const row of measured) {
      expect(dismissBackdropAlpha(row.travel)).toBeCloseTo(row.backdrop, 1)
      expect(
        Math.abs(dismissChromeAlpha(row.travel) - row.chrome),
      ).toBeLessThan(0.02)
    }
    expect(dismissBackdropAlpha(-10)).toBe(1)
    expect(dismissChromeAlpha(0)).toBe(1)
    expect(dismissChromeAlpha(1000)).toBe(0)
  })

  it('dismisses on any release unless moving up or back at the start', () => {
    // Pulls of 20, 40 and 60 pt held still, then lifted, dismiss. So do a
    // 60 pt flick and a slow downward release.
    expect(dismissCommits(20, 0)).toBe(true)
    expect(dismissCommits(60, 1500)).toBe(true)
    expect(dismissCommits(100, 40)).toBe(true)
    // A pull flicked back up cancels, as does one brought back to ~5 pt.
    expect(dismissCommits(150, -800)).toBe(false)
    expect(dismissCommits(5, 0)).toBe(false)
    expect(zoomMedia.dismiss.cancelTravel).toBeGreaterThan(5)
    expect(zoomMedia.dismiss.cancelTravel).toBeLessThan(20)
  })

  it('dismisses a short flick down: its projected travel reaches the commit point (spec:AST-094 FR36)', () => {
    // An 18 px flick reaches the stage as about 8 pt past the pan's begin
    // threshold. That is short of the commit point, but its velocity carries
    // it on.
    expect(dismissCommits(8, 600)).toBe(true)
    // The same travel lifted still springs back: nothing projects it on.
    expect(dismissCommits(8, 0)).toBe(false)
    // Moving back up cancels, however far it came.
    expect(dismissCommits(8, -600)).toBe(false)
  })

  it('decides the release at the commit point itself, and cancels one moving back toward the start', () => {
    // Exactly at the commit point and held still, the release stays: only
    // past it does a still pull dismiss.
    expect(dismissCommits(zoomMedia.dismiss.cancelTravel, 0)).toBe(false)
    expect(dismissCommits(zoomMedia.dismiss.cancelTravel + 0.01, 0)).toBe(true)
    // Above where the drag began, a release moving down moves back toward
    // the start, so it springs back however fast it moves.
    expect(dismissCommits(-5, 2000)).toBe(false)
  })

  it('sends a dismissed photo below the screen when the stage only hugs it', () => {
    const geometry = landscape()
    const t = dismissTransform(geometry, 0, 100)
    // The screen's bottom 300 px below the stage's.
    const bottom = geometry.height + 300
    const exit = dismissExitY(geometry, t, bottom)
    expect(geometry.fit.y + exit).toBeGreaterThan(bottom)
  })

  it('sends a dismissed photo below the stage with no thumbnail to return to', () => {
    const geometry = landscape()
    const t = dismissTransform(geometry, 0, 100)
    const exit = dismissExitY(geometry, t)
    expect(geometry.fit.y + exit).toBeGreaterThan(geometry.height)
    expect(exit).toBeGreaterThan(t.y)
  })

  it('plays the dismissal on the springs measured in Photos', () => {
    expect(zoomMedia.dismiss.dismissPositionSpring).toEqual({ mass: 1, stiffness: 918.09, damping: 60.6 })
    expect(zoomMedia.dismiss.dismissSizeSpring).toEqual({ mass: 1, stiffness: 947.14, damping: 61.55 })
  })
})
