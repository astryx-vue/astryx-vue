// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import TouchDateSheet from './TouchDateSheet.vue'

describe('touchDateSheet 的服务端渲染', () => {
  it('服务端不读今天，不画日历，水合时和浏览器第一帧一致', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(TouchDateSheet, { selected: null }) }))
    expect(html).not.toContain('astryx-date-touch-grid')
    expect(html).not.toContain('is-today')
  })
})
