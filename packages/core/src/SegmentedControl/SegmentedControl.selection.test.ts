/**
 * @file SegmentedControl.selection.test.ts
 * @input vitest (happy-dom), SegmentedControl.vue with stubbed segment
 *   geometry, the real animator wrapped to record what it is asked
 * @output The selection lens as each pointer meets it: where it lays out,
 *   how a change moves it under a fine pointer and under a finger, and what
 *   Reduce Motion makes of it
 * @position Testing; SegmentedControl.vue wired to useSegmentedSelection.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import type * as AnimatorModule from '../motion/animator'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { pointerQuery } from '../gestures/__tests__/pointerQuery'
import { segmentedControl } from '../motion/uikit/segmented'
import SegmentedControl from './SegmentedControl.vue'
import SegmentedControlItem from './SegmentedControlItem.vue'

interface Call {
  readonly name: string
  readonly args: unknown[]
}

interface Recorded {
  readonly element: Element
  readonly calls: Call[]
  readonly real: AnimatorModule.Animator
}

const animators: Recorded[] = []
/** What Reduce Motion makes of a motion, as the test sets it (null: the animator's own answer). */
const reduced: { mode: null | ((touchRelease: boolean) => 'off' | 'crossfade' | 'instant') } = { mode: null }

vi.mock('../motion/animator', async (importOriginal) => {
  const actual = await importOriginal<typeof AnimatorModule>()
  return {
    ...actual,
    createMotionEngine: (element: HTMLElement, options?: AnimatorModule.AnimatorOptions) => {
      const real = actual.createMotionEngine(element, options)
      const recorded: Recorded = { element, calls: [], real }
      animators.push(recorded)
      return new Proxy(real, {
        get(target, key) {
          if (key === 'reducedMotion' && reduced.mode != null)
            return (o?: { touchRelease?: boolean }) => reduced.mode!(o?.touchRelease === true)
          const value = Reflect.get(target, key) as unknown
          if (typeof value !== 'function')
            return value
          return (...args: unknown[]) => {
            if (['set', 'animate', 'play'].includes(key as string))
              recorded.calls.push({ name: key as string, args })
            return (value as (...a: unknown[]) => unknown).apply(target, args)
          }
        },
      })
    },
  }
})

enableAutoUnmount(afterEach)
afterEach(() => {
  animators.length = 0
  reduced.mode = null
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

/** The track at the viewport's origin, and each segment's box in it. */
const TRACK = { left: 0, top: 0, width: 200, height: 36 }
const BOXES: Record<string, { left: number, top: number, width: number, height: number }> = {
  a: { left: 2, top: 2, width: 60, height: 32 },
  b: { left: 64, top: 2, width: 90, height: 32 },
  c: { left: 156, top: 2, width: 40, height: 32 },
}
const centerOf = (value: string): number => BOXES[value]!.left + BOXES[value]!.width / 2

function rectOf({ left, top, width, height }: { left: number, top: number, width: number, height: number }): DOMRect {
  return { left, top, width, height, x: left, y: top, right: left + width, bottom: top + height, toJSON: () => ({}) } as DOMRect
}

/** Answers layout for the track and the segments: the test DOM has none. */
function stubLayout(): void {
  const original = HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('astryx-segmented-control'))
      return rectOf(TRACK)
    const box = this.getAttribute('role') === 'radio' ? BOXES[this.dataset.value ?? ''] : undefined
    return box == null ? original.call(this) : rectOf(box)
  })
}

async function renderControl(modelValue = 'a'): Promise<VueWrapper> {
  const wrapper: VueWrapper = mount(SegmentedControl, {
    attachTo: document.body,
    props: { 'label': 'View', modelValue, 'onUpdate:modelValue': ((value: string) => { void wrapper.setProps({ modelValue: value }) }) as (...args: unknown[]) => void },
    slots: { default: () => ['a', 'b', 'c'].map(value => h(SegmentedControlItem, { label: value.toUpperCase(), value })) },
  })
  await nextTick()
  return wrapper
}

const trackOf = (wrapper: VueWrapper): HTMLElement => wrapper.get('.astryx-segmented-control').element as HTMLElement
const lensOf = (wrapper: VueWrapper): HTMLElement => wrapper.get('.astryx-segmented-control__selection:not(.astryx-segmented-control__selection--leaving)').element as HTMLElement
const leavingOf = (wrapper: VueWrapper): HTMLElement => wrapper.get('.astryx-segmented-control__selection--leaving').element as HTMLElement
const recordedFor = (element: Element): Recorded => animators.filter(animator => animator.element === element).at(-1)!
const callsOf = (element: Element, name: string): Call[] => recordedFor(element).calls.filter(call => call.name === name)
const placement = (element: HTMLElement): string[] => [element.style.left, element.style.top, element.style.width, element.style.height]

describe('segmentedControl selection lens', () => {
  it('shows no lens without layout: the selected segment paints its own surface', async () => {
    const wrapper = await renderControl()
    expect(trackOf(wrapper).hasAttribute('data-selection')).toBe(false)
    expect(lensOf(wrapper).getAttribute('aria-hidden')).toBe('true')
  })

  it('lays the lens out on the selected segment once there is layout', async () => {
    stubLayout()
    const wrapper = await renderControl()
    expect(trackOf(wrapper).hasAttribute('data-selection')).toBe(true)
    expect(placement(lensOf(wrapper))).toEqual(['2px', '2px', '60px', '32px'])
  })

  it('under a fine pointer a change plays the segment\'s own timing from where the lens was', async () => {
    stubLayout()
    const wrapper = await renderControl()
    const lens = lensOf(wrapper)
    await wrapper.setProps({ modelValue: 'b' })
    await nextTick()
    expect(placement(lens)).toEqual(['64px', '2px', '90px', '32px'])
    const [play] = callsOf(lens, 'play')
    expect(play).toBeDefined()
    expect(callsOf(lens, 'animate')).toHaveLength(0)
    const at = (play!.args[1] as { at: number }).at
    const values = play!.args[0] as Record<string, { at: (t: number) => number }>
    // From the old center, re-based onto the new box, and the old width.
    expect(values.x!.at(0)).toBeCloseTo(centerOf('a') - centerOf('b'), 6)
    expect(values.scaleX!.at(0)).toBeCloseTo(60 / 90, 6)
    expect(typeof at).toBe('number')
  })

  it('under a finger a change slides on the selection spring', async () => {
    stubLayout()
    const query = pointerQuery(true)
    try {
      const wrapper = await renderControl()
      const lens = lensOf(wrapper)
      expect(trackOf(wrapper).hasAttribute('data-touch')).toBe(true)
      await wrapper.setProps({ modelValue: 'c' })
      await nextTick()
      const springs = callsOf(lens, 'animate')
      expect(springs.at(-1)!.args[0]).toEqual({ x: 0, scaleX: 1, scaleY: 1 })
      expect(springs.at(-1)!.args[1]).toMatchObject({ spring: segmentedControl.selectionSpring })
      const set = callsOf(lens, 'set').at(-1)!.args[0] as Record<string, number>
      expect(set.x).toBeCloseTo(centerOf('a') - centerOf('c'), 6)
      expect(set.scaleX).toBeCloseTo(60 / 40, 6)
    }
    finally {
      query.restore()
    }
  })

  it('a fine pointer under Reduce Motion lands a change at once', async () => {
    stubLayout()
    reduced.mode = touchRelease => touchRelease ? 'crossfade' : 'instant'
    const wrapper = await renderControl()
    const lens = lensOf(wrapper)
    await wrapper.setProps({ modelValue: 'b' })
    await nextTick()
    expect(placement(lens)).toEqual(['64px', '2px', '90px', '32px'])
    expect(callsOf(lens, 'play')).toHaveLength(0)
    expect(callsOf(lens, 'animate')).toHaveLength(0)
  })

  it('a finger under Reduce Motion cross-fades: the lens fades in at the new segment, the old surface fades out in place', async () => {
    stubLayout()
    reduced.mode = () => 'crossfade'
    const query = pointerQuery(true)
    try {
      const wrapper = await renderControl()
      const lens = lensOf(wrapper)
      const leaving = leavingOf(wrapper)
      await wrapper.setProps({ modelValue: 'b' })
      await nextTick()
      expect(callsOf(lens, 'animate').at(-1)!.args[2]).toMatchObject({ crossfadeAs: 'entrance' })
      expect(placement(leaving)).toEqual(['2px', '2px', '60px', '32px'])
      expect(callsOf(leaving, 'animate').at(-1)!.args[0]).toEqual({ x: centerOf('b') - centerOf('a'), opacity: 0 })
    }
    finally {
      query.restore()
    }
  })

  it('a lifted lens wears the theme\'s low elevation; under a finger the titles do not transition', () => {
    const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/segmented-control.css'), 'utf8')
    expect(css).toMatch(/__selection\[data-lifted\] \{[^}]*box-shadow: var\(--astryx-shadow-low/)
    expect(css).toMatch(/\[data-touch\] > \.astryx-segmented-control-item \{[^}]*transition-property: none/)
  })
})
