import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton.vue'

describe('skeleton', () => {
  it('renders a decorative placeholder with upstream defaults', () => {
    const wrapper = mount(Skeleton)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('converts numeric dimensions to pixels', () => {
    const wrapper = mount(Skeleton, {
      props: {
        height: 48,
        width: 240,
      },
    })

    expect(wrapper.element.style.width).toBe('240px')
    expect(wrapper.element.style.height).toBe('48px')
  })

  it('preserves CSS dimension values', () => {
    const wrapper = mount(Skeleton, {
      props: {
        height: '1.25rem',
        width: '75%',
      },
    })

    expect(wrapper.element.style.width).toBe('75%')
    expect(wrapper.element.style.height).toBe('1.25rem')
  })

  it('stagger-delays animation by 100ms for each index', () => {
    const wrapper = mount(Skeleton, {
      props: {
        index: 4,
      },
    })

    expect(wrapper.element.style.animationDelay).toBe('1400ms')
  })

  it('allows the aria-hidden default to be overridden', () => {
    const wrapper = mount(Skeleton, {
      attrs: {
        'aria-hidden': false,
      },
    })

    expect(wrapper.attributes('aria-hidden')).toBe('false')
  })
})

describe('skeleton pulse', () => {
  const css = readFileSync(resolve(__dirname, '../../styles/skeleton.css'), 'utf8')
  const frames = [...css.matchAll(/([\d.]+)% \{\s*opacity: ([\d.]+);/g)].map(match => [Number(match[1]), Number(match[2])] as const)

  it('uses a linear timing function, never steps(), so every engine animates it off the main thread', () => {
    expect(css).not.toMatch(/timing-function:\s*steps\(/)
    expect(css).toMatch(/animation-timing-function:\s*linear/)
  })

  it('holds each of ten levels from 0.25 up to 0.925, as steps(10, end) did', () => {
    const at = (percent: number): number => frames.filter(([stop]) => stop <= percent).at(-1)![1]
    for (let step = 0; step < 10; step++) {
      for (const offset of [0.5, 5, 9]) {
        expect(at(step * 10 + offset)).toBeCloseTo(0.25 + 0.075 * step, 6)
      }
    }
    expect(at(100)).toBeCloseTo(0.925, 6)
  })
})
