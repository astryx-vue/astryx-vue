import type { TimestampProps } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Timestamp from './Timestamp.vue'
import { longZoneName } from './tooltipEntries.js'

enableAutoUnmount(afterEach)

const VALUE = '2026-02-19T17:00:00Z'
const HOURS_AGO = () => Math.floor(Date.now() / 1000) - 7200

beforeEach(() => {
  document.body.innerHTML = ''
})

async function openCard(props: TimestampProps, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(Timestamp, { attachTo: document.body, props, attrs })
  await nextTick()
  const time = wrapper.get('time').element as HTMLTimeElement
  time.focus()
  time.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
  await nextTick()
  await nextTick()
  const card = document.querySelector('.astryx-hover-card') as HTMLElement
  return { card, time, wrapper }
}

describe('timestamp hover card structure', () => {
  it('keeps the copy button inside the row value and the card a description list', async () => {
    const { card } = await openCard({
      value: VALUE,
      format: 'relative',
      tooltipEntries: [
        { label: 'UTC', timezoneID: 'UTC', format: 'system_date_time', isCopyable: true },
        { label: 'Tokyo', timezoneID: 'Asia/Tokyo', format: 'system_date_time' },
      ],
    })
    const rows = card.querySelectorAll('dl > div')
    expect(rows).toHaveLength(2)
    for (const row of rows) {
      expect([...row.children].map(child => child.tagName)).toEqual(['DT', 'DD'])
    }
    expect(rows[0]!.querySelector('dd button')).not.toBeNull()
    expect(rows[1]!.querySelector('button')).toBeNull()
    expect(card.querySelector('dl > div > button, dl > div > .astryx-timestamp__action')).toBeNull()
  })

  it('names a label-less row by its time zone, in a hidden term', async () => {
    const { card } = await openCard({ value: VALUE, format: 'relative', timezoneID: 'Asia/Tokyo' })
    const term = card.querySelector('dl > div > dt')
    expect(term?.textContent?.trim()).toBe(
      new Intl.DateTimeFormat('en', { timeZoneName: 'long' }).formatToParts(new Date(VALUE)).find(part => part.type === 'timeZoneName')?.value,
    )
    expect(term?.classList.contains('astryx-timestamp__zone-name')).toBe(true)
    expect(card.querySelectorAll('dl > div > dd')).toHaveLength(1)
    expect(card.querySelectorAll('button')).toHaveLength(1)
  })
})

describe('timestamp popup semantics', () => {
  it('puts the card relationship on the focusable time and claims no popup state the role lacks', async () => {
    const { card, time } = await openCard({ value: HOURS_AGO(), format: 'relative' })
    expect(time.getAttribute('tabindex')).toBe('0')
    expect(time.getAttribute('aria-controls')).toBe(card.id)
    expect(time.hasAttribute('aria-haspopup')).toBe(false)
    expect(time.hasAttribute('aria-expanded')).toBe(false)
  })

  it('leaves no aria-controls on the time while the card is closed', async () => {
    const wrapper = mount(Timestamp, { attachTo: document.body, props: { value: HOURS_AGO(), format: 'relative' } })
    await nextTick()
    expect(wrapper.get('time').attributes('aria-controls')).toBeUndefined()
  })
})

describe('timestamp pass-through attributes', () => {
  it('keeps a caller aria-label and tabindex, and forwards other attributes to the time', async () => {
    const wrapper = mount(Timestamp, {
      attachTo: document.body,
      props: { value: HOURS_AGO(), format: 'relative' },
      attrs: { 'aria-label': 'Posted 2 hours ago', 'tabindex': -1, 'data-testid': 'stamp', 'id': 'stamp' },
    })
    await nextTick()
    const time = wrapper.get('time')
    expect(time.attributes('aria-label')).toBe('Posted 2 hours ago')
    expect(time.attributes('tabindex')).toBe('-1')
    expect(time.attributes('data-testid')).toBe('stamp')
    expect(time.attributes('id')).toBe('stamp')
  })

  it('names a relative time by the words it shows, then the full date', async () => {
    const wrapper = mount(Timestamp, { attachTo: document.body, props: { value: HOURS_AGO(), format: 'relative' } })
    await nextTick()
    const time = wrapper.get('time')
    const label = time.attributes('aria-label')!
    expect(label.startsWith(`${time.text()}, `)).toBe(true)
    expect(label.endsWith(longZoneName(new Date(), 'en'))).toBe(true)
  })

  it('joins the words and the date with the locale separator', async () => {
    const host = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Timestamp, { value: HOURS_AGO(), format: 'relative' })
      },
    })
    const wrapper = mount(host, { attachTo: document.body })
    await nextTick()
    const time = wrapper.get('time')
    expect(time.attributes('aria-label')!.startsWith(`${time.text()}，`)).toBe(true)
  })
})

describe('timestamp live refresh and focus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('waits to refresh while the control named by the time has focus, then catches up', async () => {
    const start = new Date('2026-03-25T12:00:00Z')
    vi.setSystemTime(start)
    const Host = defineComponent({
      render: () => h('button', { type: 'button', id: 'owner' }, [
        h(Timestamp, { value: start.getTime() - 30_000, format: 'relative', isLive: true, hasTooltip: false }),
      ]),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const read = () => wrapper.get('time').text()
    expect(read()).toBe('30 seconds ago')

    const button = wrapper.get('#owner').element as HTMLButtonElement
    button.focus()
    await nextTick()
    vi.advanceTimersByTime(20_000)
    await nextTick()
    expect(read()).toBe('30 seconds ago')

    button.blur()
    await nextTick()
    expect(read()).toBe('50 seconds ago')
  })

  it('keeps ticking when nothing it names has focus', async () => {
    const start = new Date('2026-03-25T12:00:00Z')
    vi.setSystemTime(start)
    const wrapper = mount(Timestamp, {
      attachTo: document.body,
      props: { value: start.getTime() - 30_000, format: 'relative', isLive: true, hasTooltip: false },
    })
    await nextTick()
    vi.advanceTimersByTime(20_000)
    await nextTick()
    expect(wrapper.get('time').text()).toBe('50 seconds ago')
  })
})
