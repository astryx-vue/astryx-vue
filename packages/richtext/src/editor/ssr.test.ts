import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { markdownToEditorStateJSON } from '../markdownSerializers.js'
import RichTextEditor from './RichTextEditor.vue'
import RichTextEditorToolbar from './RichTextEditorToolbar.vue'

/**
 * 服务端渲染：没有 DOM，也没有 `requestAnimationFrame` 和 `ResizeObserver`。
 * 测试环境是 happy-dom（和其他包一致），这里把这几个浏览器才有的东西临时拿掉，
 * 验证编辑器能只渲染外框、不去碰它们。
 */
describe('server-side rendering', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    vi.stubGlobal('cancelAnimationFrame', undefined)
    vi.stubGlobal('ResizeObserver', undefined)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the frame and the label without requestAnimationFrame', async () => {
    const app = createSSRApp({ render: () => h(RichTextEditor, { label: 'Notes', placeholder: 'Write something' }) })
    const html = await renderToString(app)
    expect(html).toContain('Notes')
    expect(html).toContain('astryx-richtext-editor')
    expect(html).toContain('Write something')
  })

  it('renders with a toolbar and with initial content', async () => {
    const app = createSSRApp({
      render: () => h(RichTextEditor, { label: 'Notes', defaultValue: markdownToEditorStateJSON('- [ ] open\n\n```js\nconst a = 1\n```\n') }, { toolbar: () => h(RichTextEditorToolbar) }),
    })
    const html = await renderToString(app)
    expect(html).toContain('Text formatting')
  })
})
