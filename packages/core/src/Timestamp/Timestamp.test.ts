import type { TimestampFormat } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, onUpdated, ref } from 'vue'
import { formatInstant } from './formatInstant.js'
import { formatRelativeTime } from './formatRelativeTime.js'
import Timestamp from './Timestamp.vue'
import { formatTooltipLines } from './tooltipEntries.js'

const DATE = new Date('2026-02-19T17:00:00Z')

describe('timestamp formatting', () => {
  it('formats absolute instants in a named zone', () => {
    expect(formatInstant(DATE, 'system_date_time', 'en', { timeZone: 'UTC' })).toBe('2026-02-19 17:00:00')
    expect(formatInstant(DATE, 'unix_seconds', 'en')).toBe('1771520400')
    expect(formatInstant(DATE, 'date', 'en', { timeZone: 'UTC' })).toContain('2026')
  })

  it('treats a few seconds ago as now and one day ago as yesterday', () => {
    const now = new Date('2026-02-19T17:00:00Z')
    expect(formatRelativeTime(new Date(now.getTime() - 5_000), now, 'en', 'long')).toBe('now')
    expect(formatRelativeTime(new Date(now.getTime() - 86_400_000), now, 'en', 'long')).toBe('yesterday')
  })

  it('marks a named tooltip zone and leaves an unknown zone on the viewer clock', () => {
    const lines = formatTooltipLines(DATE, [
      { format: 'system_date_time', label: 'UTC', timezoneID: 'UTC' },
      { format: 'system_date_time', label: 'Broken', timezoneID: 'Not/AZone' },
    ], 'en')
    expect(lines[0]?.value).toBe('2026-02-19 17:00:00')
    expect(lines[1]?.value).toMatch(/^\d{4}-\d{2}-\d{2} /)
    expect(lines.every(line => line.isCopyable === false)).toBe(true)
  })
})

describe('timestamp', () => {
  it('renders a time element and nothing for an invalid value', () => {
    const wrapper = mount(Timestamp, {
      props: { value: '2026-02-19T17:00:00Z', format: 'unix_seconds', hasTooltip: false },
    })
    expect(wrapper.get('time').attributes('datetime')).toBe('2026-02-19T17:00:00.000Z')
    expect(wrapper.text()).toBe('1771520400')

    const invalid = mount(Timestamp, { props: { value: 'not-a-date' } })
    expect(invalid.find('time').exists()).toBe(false)
  })

  it('uses a relative phrase inside the auto window', async () => {
    const now = Math.floor(Date.now() / 1000)
    const wrapper = mount(Timestamp, {
      props: { value: now - 120, format: 'relative', hasTooltip: false, color: 'primary' },
    })
    await nextTick()
    expect(wrapper.get('time').attributes('aria-label')).toBeTruthy()
    expect(wrapper.text().toLowerCase()).toContain('minute')
  })
})

/** 服务端和 hydration 那一趟写出的完整日期时间：带时区标签的 UTC。 */
function placeholderText(seconds: number): string {
  return formatInstant(new Date(seconds * 1000), 'date_time', 'en', { timeZone: 'UTC', isTimezoneShown: true })
}

/** 从渲染结果里取出 `<time>` 的文本。 */
function timeText(html: string): string {
  return /<time[^>]*>([^<]*)<\/time>/.exec(html)?.[1] ?? ''
}

/**
 * 数一遍 `run` 执行期间读了几次当前时间（不带参数的 `new Date()`）。
 */
async function countClockReads(run: () => Promise<unknown>): Promise<number> {
  const ActiveDate = globalThis.Date
  let reads = 0
  class CountingDate extends ActiveDate {
    constructor(...args: [] | [string | number | Date]) {
      if (args.length === 0)
        reads += 1
      super(...(args as [string | number | Date]))
    }
  }
  globalThis.Date = CountingDate as DateConstructor
  try {
    await run()
  }
  finally {
    globalThis.Date = ActiveDate
  }
  return reads
}

const SERVER_VALUE = '2026-03-25T10:00:00Z'
const SERVER_SECONDS = Date.parse(SERVER_VALUE) / 1000

function renderOnServer(props: { value: string | number, format: TimestampFormat }): Promise<string> {
  return renderToString(createSSRApp({ render: () => h(Timestamp, props) }))
}

describe('timestamp on the server', () => {
  it.each(['date', 'date_time', 'time', 'unix_seconds'] as const)(
    'never reads the current time for the absolute %s format',
    async (format) => {
      expect(await countClockReads(() => renderOnServer({ value: SERVER_VALUE, format }))).toBe(0)
      expect(await countClockReads(async () => {
        const wrapper = mount(Timestamp, { props: { value: SERVER_VALUE, format } })
        await nextTick()
        wrapper.unmount()
      })).toBe(0)
    },
  )

  it.each(['relative', 'relative_short', 'auto'] as const)(
    'renders the %s format as the full date and time in UTC without reading the clock',
    async (format) => {
      let html = ''
      const reads = await countClockReads(async () => {
        html = await renderOnServer({ value: SERVER_VALUE, format })
      })
      expect(reads).toBe(0)
      expect(timeText(html)).toBe(placeholderText(SERVER_SECONDS))
    },
  )

  it('writes the same markup whatever the server time zone', async () => {
    const originalTZ = process.env.TZ
    try {
      process.env.TZ = 'UTC'
      const utc = await renderOnServer({ value: '2026-03-25T23:30:00Z', format: 'relative' })
      process.env.TZ = 'Asia/Tokyo'
      expect(await renderOnServer({ value: '2026-03-25T23:30:00Z', format: 'relative' })).toBe(utc)
      // 对照：同一个值在绝对格式下按服务器时区换日期，说明上面比的是真的 UTC 占位文本。
      expect(timeText(await renderOnServer({ value: '2026-03-25T23:30:00Z', format: 'date' }))).toContain('26')
    }
    finally {
      if (originalTZ === undefined)
        delete process.env.TZ
      else
        process.env.TZ = originalTZ
    }
  })
})

describe('timestamp during hydration', () => {
  const HYDRATION_SECONDS = Math.floor(Date.now() / 1000) - 7200

  /** 造一个装着服务端 HTML 的容器，hydrate 完再拆掉。 */
  async function hydrateServerHtml(): Promise<{ host: HTMLDivElement, unmount: () => void }> {
    const host = document.createElement('div')
    document.body.appendChild(host)
    host.innerHTML = await renderOnServer({ value: HYDRATION_SECONDS, format: 'relative' })
    return { host, unmount: () => host.remove() }
  }

  it('keeps the server markup, then shows the relative phrase', async () => {
    const { host, unmount } = await hydrateServerHtml()
    expect(host.textContent).toBe(placeholderText(HYDRATION_SECONDS))

    const warnings = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const app = createSSRApp({ render: () => h(Timestamp, { value: HYDRATION_SECONDS, format: 'relative' }) })
      app.mount(host)
      // hydration 那一趟仍未读时钟，文本和服务端一致。
      expect(host.textContent).toBe(placeholderText(HYDRATION_SECONDS))
      await nextTick()
      expect(host.textContent).toBe('2 hours ago')
      expect(warnings).not.toHaveBeenCalled()
      expect(errors).not.toHaveBeenCalled()
      app.unmount()
    }
    finally {
      warnings.mockRestore()
      errors.mockRestore()
      unmount()
    }
  })

  it('hydrates markup written in another time zone without a mismatch', async () => {
    const originalTZ = process.env.TZ
    process.env.TZ = 'UTC'
    const html = await renderOnServer({ value: HYDRATION_SECONDS, format: 'relative' })
    process.env.TZ = 'America/Los_Angeles'
    const host = document.createElement('div')
    document.body.appendChild(host)
    host.innerHTML = html

    const warnings = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(host.textContent).toBe(placeholderText(HYDRATION_SECONDS))
      const app = createSSRApp({ render: () => h(Timestamp, { value: HYDRATION_SECONDS, format: 'relative' }) })
      app.mount(host)
      await nextTick()
      expect(host.textContent).toBe('2 hours ago')
      expect(warnings).not.toHaveBeenCalled()
      app.unmount()
    }
    finally {
      warnings.mockRestore()
      host.remove()
      if (originalTZ === undefined)
        delete process.env.TZ
      else
        process.env.TZ = originalTZ
    }
  })
})

describe('timestamp after mount', () => {
  it('never commits the UTC placeholder when a mounted Timestamp switches to a relative format', async () => {
    const value = Math.floor(Date.now() / 1000) - 7200
    const committed: string[] = []
    const Host = defineComponent({
      props: { format: { type: String, required: true } },
      setup(props) {
        const root = ref<HTMLElement | null>(null)
        onUpdated(() => {
          committed.push(root.value?.querySelector('time')?.textContent ?? '')
        })
        return () => h('div', { ref: root }, [
          h(Timestamp, { value, format: props.format as TimestampFormat, hasTooltip: false }),
        ])
      },
    })
    const wrapper = mount(Host, { props: { format: 'date' }, attachTo: document.body })
    try {
      await nextTick()
      committed.length = 0
      await wrapper.setProps({ format: 'relative' })
      expect(wrapper.get('time').text()).toBe('2 hours ago')
      expect(committed.some(text => text.includes('UTC'))).toBe(false)
    }
    finally {
      wrapper.unmount()
    }
  })
})
