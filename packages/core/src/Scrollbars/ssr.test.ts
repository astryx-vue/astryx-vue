// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import ScrollableArea from '../ScrollableArea/ScrollableArea.vue'

const created = vi.hoisted(() => [] as unknown[])

vi.mock('overlayscrollbars', () => ({
  OverlayScrollbars: vi.fn((...args: unknown[]) => {
    created.push(args)
  }),
}))

const { default: ScrollbarsProvider } = await import('./ScrollbarsProvider.vue')

describe('scrollbars on the server', () => {
  it('renders without touching DOM globals or OverlayScrollbars', async () => {
    expect(typeof HTMLElement).toBe('undefined')
    const html = await renderToString(createSSRApp({
      render: () => h(ScrollbarsProvider, null, {
        default: () => h(ScrollableArea, { label: 'List' }, { default: () => 'row' }),
      }),
    }))
    expect(html).toContain('astryx-scrollable-area')
    expect(created).toHaveLength(0)
  })
})
