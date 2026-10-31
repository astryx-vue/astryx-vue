import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
// @vitest-environment node
import { renderToString } from 'vue/server-renderer'
import { markdownToEditorStateJSON } from '../markdownSerializers.js'
import RichTextEditor from './RichTextEditor.vue'
import RichTextEditorToolbar from './RichTextEditorToolbar.vue'

describe('server-side rendering', () => {
  it('has no DOM in this environment', () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    expect(typeof requestAnimationFrame).toBe('undefined')
  })

  it('renders the frame and the label without touching the browser', async () => {
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
