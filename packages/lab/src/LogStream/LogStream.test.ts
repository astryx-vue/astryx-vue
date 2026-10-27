import type { LogEntry } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import LogStream from './LogStream.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

const ENTRIES: LogEntry[] = [
  { id: 'a', timestamp: '14:02:11.482', level: 'info', source: 'api-gateway', message: 'request accepted' },
  { id: 'b', timestamp: '14:02:11.617', level: 'warn', source: 'billing', message: 'retrying upstream call' },
  { id: 'c', timestamp: '14:02:12.044', level: 'error', source: 'billing', message: 'upstream call failed', detail: 'stack: billing.charge failed with 502' },
  { id: 'd', timestamp: '14:02:12.371', level: 'debug', source: 'api-gateway', message: 'connection pool at 40%' },
]

/** happy-dom 没有布局：手动伪造滚动区的几何数据。 */
function setScrollMetrics(el: HTMLElement, { scrollHeight, clientHeight }: { scrollHeight: number, clientHeight: number }) {
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true })
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true })
}

function renderStream(props: Record<string, unknown> = {}, slots: Record<string, (scope: { entry: LogEntry }) => unknown> = {}) {
  return mount(LogStream, { attachTo: document.body, props: { entries: ENTRIES, ...props }, slots })
}

function scrollerOf(wrapper: ReturnType<typeof renderStream>): HTMLElement {
  return wrapper.get('[role="log"]').element as HTMLElement
}

describe('logStream', () => {
  it('renders one row per entry with level and message', () => {
    const wrapper = renderStream()
    for (const text of ['request accepted', 'retrying upstream call', 'upstream call failed', 'connection pool at 40%', 'info', 'warn', 'error', 'debug'])
      expect(wrapper.text()).toContain(text)

    // 级别落在行元素上，主题可以按它选样式。
    const row = wrapper.findAll('.astryx-log-stream__row').find(node => node.text().includes('upstream call failed'))
    expect(row?.attributes('data-level')).toBe('error')
  })

  it('exposes the scroller as an accessible log region', () => {
    const log = scrollerOf(renderStream({ label: 'Build output' }))
    expect(log.getAttribute('role')).toBe('log')
    expect(log.getAttribute('aria-label')).toBe('Build output')
  })

  it('renders timestamps by default and hides them with hasTimestamps=false', async () => {
    const wrapper = renderStream()
    expect(wrapper.text()).toContain('14:02:11.482')
    await wrapper.setProps({ hasTimestamps: false })
    expect(wrapper.text()).not.toContain('14:02:11.482')
    const row = wrapper.get('.astryx-log-stream__row')
    expect(row.attributes('data-cols')).toBe('no-timestamp')
  })

  it('expands and collapses detail rows via the row button', async () => {
    const wrapper = renderStream()
    // 只有带 detail 的那一行是展开按钮。
    const buttons = wrapper.findAll('button[aria-expanded]')
    expect(buttons).toHaveLength(1)
    const row = buttons[0]
    expect(row.text()).toContain('upstream call failed')
    expect(wrapper.text()).not.toContain('stack: billing.charge failed with 502')
    expect(row.attributes('aria-expanded')).toBe('false')

    await row.trigger('click')
    expect(row.attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('stack: billing.charge failed with 502')

    await row.trigger('click')
    expect(row.attributes('aria-expanded')).toBe('false')
    expect(wrapper.text()).not.toContain('stack: billing.charge failed with 502')
  })

  it('pins scroll to the bottom on append while following', async () => {
    const wrapper = renderStream({ isFollowing: true, maxHeight: 200 })
    const scroller = scrollerOf(wrapper)
    setScrollMetrics(scroller, { scrollHeight: 1000, clientHeight: 200 })

    await wrapper.setProps({
      entries: [...ENTRIES, { id: 'e', timestamp: '14:02:13.005', level: 'info', source: 'api-gateway', message: 'request completed' }],
    })
    await nextTick()
    await nextTick()
    expect(scroller.scrollTop).toBe(1000)
  })

  it('unpins when the user scrolls away from the bottom', () => {
    const wrapper = renderStream({ isFollowing: true, maxHeight: 200 })
    const scroller = scrollerOf(wrapper)
    setScrollMetrics(scroller, { scrollHeight: 1000, clientHeight: 200 })

    // 用户把滚动条拖到离尾部很远的地方。
    scroller.scrollTop = 100
    scroller.dispatchEvent(new Event('scroll'))
    expect(wrapper.emitted('followChange')).toEqual([[false]])
  })

  it('does not unpin on scroll events that stay at the bottom', () => {
    const wrapper = renderStream({ isFollowing: true, maxHeight: 200 })
    const scroller = scrollerOf(wrapper)
    setScrollMetrics(scroller, { scrollHeight: 1000, clientHeight: 200 })

    scroller.scrollTop = 800 // 正好在底部
    scroller.dispatchEvent(new Event('scroll'))
    expect(wrapper.emitted('followChange')).toBeUndefined()
  })

  it('re-pins via the "Jump to latest" affordance', async () => {
    const onFollow = vi.fn()
    const wrapper = renderStream({ isFollowing: false, maxHeight: 200, onFollowChange: onFollow })
    const scroller = scrollerOf(wrapper)
    setScrollMetrics(scroller, { scrollHeight: 1000, clientHeight: 200 })

    // 视口（假定）在底部时不显示这个按钮。
    expect(wrapper.find('.astryx-log-stream__jump').exists()).toBe(false)

    scroller.scrollTop = 0
    scroller.dispatchEvent(new Event('scroll'))
    await nextTick()

    const jump = wrapper.get('.astryx-log-stream__jump')
    expect(jump.text()).toContain('Jump to latest')
    await jump.trigger('click')
    expect(wrapper.emitted('followChange')).toEqual([[true]])
    expect(onFollow).toHaveBeenCalledWith(true)
    expect(scroller.scrollTop).toBe(1000)
  })

  it('supports uncontrolled follow state', async () => {
    const wrapper = renderStream({ maxHeight: 200 })
    const scroller = scrollerOf(wrapper)
    setScrollMetrics(scroller, { scrollHeight: 1000, clientHeight: 200 })

    // 默认不跟随：追加的行不会动视口。
    scroller.scrollTop = 100
    scroller.dispatchEvent(new Event('scroll'))
    await wrapper.setProps({ entries: [...ENTRIES, { id: 'e', timestamp: '14:02:13.005', level: 'info', message: 'tick' }] })
    await nextTick()
    expect(scroller.scrollTop).toBe(100)

    // 跳到最新就跟随了，下一次追加会跟到底部。
    await wrapper.get('.astryx-log-stream__jump').trigger('click')
    expect(scroller.scrollTop).toBe(1000)
    await wrapper.setProps({
      entries: [
        ...ENTRIES,
        { id: 'e', timestamp: '14:02:13.005', level: 'info', message: 'tick' },
        { id: 'f', timestamp: '14:02:14.005', level: 'info', message: 'tock' },
      ],
    })
    await nextTick()
    await nextTick()
    expect(scroller.scrollTop).toBe(1000)
  })

  it('mutes live announcements while unfollowed and restores them while following (controlled)', async () => {
    const wrapper = renderStream({ isFollowing: false })
    expect(scrollerOf(wrapper).getAttribute('aria-live')).toBe('off')
    await wrapper.setProps({ isFollowing: true })
    expect(scrollerOf(wrapper).getAttribute('aria-live')).toBe('polite')
  })

  it('unmutes the live region when "Jump to latest" resumes following (uncontrolled)', async () => {
    const wrapper = renderStream({ maxHeight: 200 })
    const log = scrollerOf(wrapper)
    // 初始不跟随，日志流不主动念。
    expect(log.getAttribute('aria-live')).toBe('off')

    setScrollMetrics(log, { scrollHeight: 1000, clientHeight: 200 })
    log.scrollTop = 100
    log.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(log.getAttribute('aria-live')).toBe('off')

    await wrapper.get('.astryx-log-stream__jump').trigger('click')
    expect(log.getAttribute('aria-live')).toBe('polite')
  })

  it('lets a scoped slot replace the default row', () => {
    const wrapper = renderStream({}, { entry: ({ entry }: { entry: LogEntry }) => h('div', `CUSTOM ${entry.id}`) })
    expect(wrapper.text()).toContain('CUSTOM a')
    expect(wrapper.text()).toContain('CUSTOM c')
    expect(wrapper.text()).not.toContain('request accepted')
    expect(wrapper.find('button[aria-expanded]').exists()).toBe(false)
  })

  it('renders rich detail content from the detail slot', async () => {
    const wrapper = renderStream({}, { detail: ({ entry }: { entry: LogEntry }) => h('pre', { 'data-testid': 'detail' }, `trace for ${entry.id}`) })
    await wrapper.get('button[aria-expanded]').trigger('click')
    expect(wrapper.get('[data-testid="detail"]').text()).toBe('trace for c')
  })

  it('marks the terminal variant on the root element', () => {
    const wrapper = renderStream({ variant: 'terminal' })
    expect(wrapper.get('.astryx-log-stream').attributes('data-variant')).toBe('terminal')
  })

  it('renders on the server', async () => {
    const app = createSSRApp({ render: () => h(LogStream, { entries: ENTRIES, label: 'Build output' }) })
    const html = await renderToString(app)
    expect(html).toContain('role="log"')
    expect(html).toContain('aria-label="Build output"')
    expect(html).toContain('data-cols="full"')
    expect(html).toContain('request accepted')
  })
})
