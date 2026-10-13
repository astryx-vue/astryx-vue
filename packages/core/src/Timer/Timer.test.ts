import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Timer from './Timer.vue'

describe('timer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('writes the elapsed reading onto the time element without a reactive tick', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const wrapper = mount(Timer, {
      props: { startTime: Date.parse('2026-01-01T00:00:00.000Z') - 75_000 },
    })
    const time = wrapper.get('time')
    expect(time.text()).toBe('1m 15s')
    expect(time.attributes('datetime')).toBe('PT75S')
    expect(wrapper.get('.astryx-timer').attributes('data-color')).toBe('secondary')
  })

  it('uses clock notation and can inherit the surrounding type', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:01:15.000Z'))
    const wrapper = mount(Timer, {
      props: {
        format: 'clock',
        startTime: Date.parse('2026-01-01T00:00:00.000Z'),
        type: 'inherit',
        color: 'inherit',
      },
    })
    const time = wrapper.get('time')
    expect(time.text()).toBe('1:15')
    expect(time.classes()).toContain('astryx-timer')
    expect(wrapper.find('.astryx-text').exists()).toBe(false)
  })
})
