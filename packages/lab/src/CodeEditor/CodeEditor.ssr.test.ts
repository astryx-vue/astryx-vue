import { renderToString } from '@vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import CodeEditor from './CodeEditor.vue'

describe('codeEditor SSR', () => {
  it('renders controlled code and its accessible name without browser APIs', async () => {
    const app = createSSRApp({
      render: () => h(CodeEditor, {
        value: 'const answer = 42;',
        label: 'Example code',
        hasLineNumbers: true,
      }),
    })
    const html = await renderToString(app)
    expect(html).toContain('const answer = 42;')
    expect(html).toContain('aria-label="Example code"')
    expect(html).toContain('>1</div>')
  })
})
