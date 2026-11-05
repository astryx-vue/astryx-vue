// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import DropdownMenu from './DropdownMenu.vue'

describe('dropdownMenu 底部面板 SSR', () => {
  it('服务端首次渲染不等待异步面板，也不产生浏览器错误', async () => {
    const app = createSSRApp({
      render: () => h(DropdownMenu, {
        button: { label: 'Actions' },
        presentation: 'bottom-sheet',
        items: [{ label: 'Edit' }],
      }),
    })

    const html = await renderToString(app)
    expect(html).toContain('Actions')
    expect(html).not.toContain('role="dialog"')
  })
})
