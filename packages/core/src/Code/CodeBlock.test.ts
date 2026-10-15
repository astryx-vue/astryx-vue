import type { VueWrapper } from '@vue/test-utils'
import type { CodeBlockProps } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import CodeBlock from './CodeBlock.vue'

enableAutoUnmount(afterEach)

const LONG_CODE = Array.from({ length: 15 }, (_, index) => `const line${index} = ${index};`).join('\n')
const writeText = vi.fn<(text: string) => Promise<void>>()

beforeEach(() => {
  writeText.mockReset()
  writeText.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
})

afterEach(() => {
  vi.useRealTimers()
})

function renderCodeBlock(
  props: Partial<CodeBlockProps> & { code: string },
  attrs: Record<string, string> = {},
): VueWrapper<InstanceType<typeof CodeBlock>> {
  return mount(CodeBlock, {
    attachTo: document.body,
    attrs,
    props: { language: 'javascript', ...props },
  })
}

/** Let the async copy handler and the re-render it triggers finish. */
async function settle(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function copyButton(wrapper: VueWrapper<InstanceType<typeof CodeBlock>>) {
  return wrapper.get('.astryx-code-block-copy-button')
}

describe('codeBlock', () => {
  it('renders the code inside a pre root with the visual axes', () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    const root = wrapper.get('pre')
    expect(root.classes()).toContain('astryx-code-block')
    expect(root.attributes('data-container')).toBe('card')
    expect(root.attributes('data-language')).toBe('javascript')
    expect(root.attributes('data-size')).toBe('md')
    expect(wrapper.vm.element).toBe(root.element)
  })

  it('paints syntax tokens with span classes', () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    const keyword = wrapper.get('.astryx-token-keyword')
    expect(keyword.text()).toBe('const')
    expect(wrapper.get('.astryx-code-block__code').text()).toBe('const x = 1;')
  })

  it('keeps the source text and drops a trailing empty line', () => {
    const wrapper = renderCodeBlock({ code: 'const a = 1;\nconst b = 2;\n' })

    expect(wrapper.findAll('[data-line]')).toHaveLength(2)
  })

  it('composes root attributes, class, and style', () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' }, {
      'aria-describedby': 'code-help',
      'class': 'consumer-code-block',
      'data-testid': 'code-block-root',
      'style': 'opacity: 0.75',
    })

    const root = wrapper.get('pre')
    expect(root.attributes('aria-describedby')).toBe('code-help')
    expect(root.attributes('data-testid')).toBe('code-block-root')
    expect(root.classes()).toContain('consumer-code-block')
    expect(root.attributes('style')).toContain('opacity: 0.75')
  })

  it('names the code viewport after the language, or Code when no label shows', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    const region = wrapper.get('.astryx-code-block__scroll')
    expect(region.attributes('role')).toBe('group')
    expect(region.attributes('tabindex')).toBe('0')
    expect(region.attributes('aria-label')).toBe('javascript')

    await wrapper.setProps({ hasLanguageLabel: false })
    expect(wrapper.get('.astryx-code-block__scroll').attributes('aria-label')).toBe('Code')
  })

  it('shows a header with the title and language label', () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;', language: 'typescript', title: 'example.ts' })

    const title = wrapper.get('.astryx-code-block-title')
    expect(wrapper.find('.astryx-code-block-header').exists()).toBe(true)
    expect(title.text()).toBe('example.ts — typescript')
  })

  it('renders no header for plaintext without a title, and floats the copy button', () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;', language: 'plaintext' })

    expect(wrapper.find('.astryx-code-block-header').exists()).toBe(false)
    const button = copyButton(wrapper)
    expect(button.classes()).toContain('astryx-code-block-copy-button--floating')
    expect(button.element.parentElement).toBe(wrapper.get('pre').element)
  })

  it('renders line numbers and highlighted lines', async () => {
    const wrapper = renderCodeBlock({ code: 'const a = 1;\nconst b = 2;', hasLineNumbers: true, highlightLines: [2] })

    expect(wrapper.get('.astryx-code-block__code').attributes('data-numbered')).toBe('true')
    const lines = wrapper.findAll('[data-line]')
    expect(lines[0].attributes('data-line')).toBe('1')
    expect(lines[0].classes()).toContain('astryx-code-block__line--numbered')
    expect(lines[1].classes()).toContain('astryx-code-block__line--highlighted')

    await wrapper.setProps({ highlightLines: [1] })
    expect(wrapper.findAll('[data-line]')[1].classes()).not.toContain('astryx-code-block__line--highlighted')
    expect(wrapper.findAll('[data-line]')[0].classes()).toContain('astryx-code-block__line--highlighted')
  })

  it('applies a zero pixel max height', () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;', maxHeight: 0 })

    expect(wrapper.get('.astryx-code-block__scroll').attributes('style')).toContain('max-height: 0px;')
  })

  it('wraps long lines only when asked to', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    expect(wrapper.get('.astryx-code-block__code').attributes('data-wrapped')).toBeUndefined()

    await wrapper.setProps({ isWrapped: true })
    expect(wrapper.get('.astryx-code-block__code').attributes('data-wrapped')).toBe('true')
  })

  it('sizes the block and the section container through data attributes', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;', width: '100%', size: 'sm', container: 'section' })

    const root = wrapper.get('pre')
    expect(root.attributes('style')).toContain('width: 100%;')
    expect(root.attributes('style')).not.toContain('min-width')
    expect(wrapper.get('.astryx-code-block__code').attributes('data-size')).toBe('sm')
    expect(root.attributes('data-container')).toBe('section')

    await wrapper.setProps({ width: 'fit-content' })
    expect(root.attributes('style')).toContain('min-width: min(100%, 400px);')
    expect(root.attributes('style')).toContain('max-width: 100%;')
  })

  it('copies the exact code string, emits copy, and confirms in the control name', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    await copyButton(wrapper).trigger('click')
    await settle()

    expect(writeText).toHaveBeenCalledWith('const x = 1;')
    expect(wrapper.emitted('copy')).toHaveLength(1)
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copied')
    expect(copyButton(wrapper).attributes('aria-describedby')).toBeTruthy()
  })

  it('announces the copy politely, and keeps the visible hint reading Copy code', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    await copyButton(wrapper).trigger('click')
    await settle()

    const [tooltipId] = (copyButton(wrapper).attributes('aria-describedby') ?? '').split(' ')
    expect(wrapper.findAll('[role="status"]').some(status => status.text() === 'Copied')).toBe(true)
    expect(document.getElementById(tooltipId)?.textContent).toBe('Copy code')
  })

  it('reports no success when the clipboard write fails', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    await copyButton(wrapper).trigger('click')
    await settle()

    expect(wrapper.emitted('copy')).toBeUndefined()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copy code')
    expect(wrapper.findAll('[role="status"]').some(status => status.text() === 'Copied')).toBe(false)
  })

  it('reverts the copied state after two seconds and restarts on a rapid re-copy', async () => {
    vi.useFakeTimers()
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })

    await copyButton(wrapper).trigger('click')
    await settle()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copied')

    vi.advanceTimersByTime(1500)
    await copyButton(wrapper).trigger('click')
    await settle()

    vi.advanceTimersByTime(600)
    await nextTick()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copied')

    vi.advanceTimersByTime(1400)
    await nextTick()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copy code')
  })

  it('honors a custom copy label', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;', copyLabel: 'Copier', copiedLabel: 'Copié' })

    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copier')

    await copyButton(wrapper).trigger('click')
    await settle()
    expect(copyButton(wrapper).attributes('aria-label')).toBe('Copié')
  })

  it('paints a custom tokenizer output without changing the source', async () => {
    const wrapper = renderCodeBlock({
      code: 'hello world',
      language: 'plaintext',
      tokenizer: code => [{ type: 'tag', start: 0, end: code.length }],
    })

    expect(wrapper.get('.astryx-token-tag').text()).toBe('hello world')

    await copyButton(wrapper).trigger('click')
    await settle()
    expect(writeText).toHaveBeenCalledWith('hello world')
  })

  it('follows the language after mount, which a frozen snapshot would not', async () => {
    const wrapper = renderCodeBlock({ code: 'const x = 1;' })
    expect(wrapper.find('.astryx-token-keyword').exists()).toBe(true)

    await wrapper.setProps({ language: 'plaintext' })
    expect(wrapper.find('.astryx-token-keyword').exists()).toBe(false)
    expect(wrapper.get('.astryx-code-block__code').text()).toBe('const x = 1;')
  })

  it('tokenizes long code asynchronously and still paints it', async () => {
    const code = Array.from({ length: 120 }, (_, index) => `const value${index} = ${index};`).join('\n')
    const wrapper = renderCodeBlock({ code })

    await vi.waitFor(() => {
      expect(wrapper.find('.astryx-token-keyword').exists()).toBe(true)
    })
  })
})

describe('codeBlock collapse', () => {
  it('makes the visible header a disclosure control for long blocks', async () => {
    const wrapper = renderCodeBlock({ code: LONG_CODE, title: 'example.ts', isCollapsible: true })

    const control = wrapper.get('[role="button"]')
    expect(control.attributes('aria-expanded')).toBe('true')
    const region = wrapper.get(`#${control.attributes('aria-controls')}`)
    expect(region.element.contains(wrapper.get('.astryx-code-block__scroll').element)).toBe(true)
    expect(region.attributes('inert')).toBeUndefined()

    await control.trigger('click')
    expect(wrapper.get('[role="button"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get(`#${wrapper.get('[role="button"]').attributes('aria-controls')}`).attributes('inert')).toBeDefined()
  })

  it('toggles with Enter and Space', async () => {
    const wrapper = renderCodeBlock({ code: LONG_CODE, title: 'example.ts', isCollapsible: true })
    const control = wrapper.get('[role="button"]')

    await control.trigger('keydown', { key: 'Enter' })
    expect(wrapper.get('[role="button"]').attributes('aria-expanded')).toBe('false')

    await control.trigger('keydown', { key: ' ' })
    expect(wrapper.get('[role="button"]').attributes('aria-expanded')).toBe('true')
  })

  it('stays a plain header below the line threshold', () => {
    const wrapper = renderCodeBlock({ code: 'const a = 1;', title: 'example.ts', isCollapsible: true })

    expect(wrapper.find('[role="button"]').exists()).toBe(false)
    expect(wrapper.find('.astryx-code-block__collapse').exists()).toBe(false)
  })

  it('expands again when the collapse control disappears', async () => {
    const wrapper = renderCodeBlock({ code: LONG_CODE, title: 'example.ts', isCollapsible: true })

    await wrapper.get('[role="button"]').trigger('click')
    expect(wrapper.find('[inert]').exists()).toBe(true)

    await wrapper.setProps({ title: undefined, hasLanguageLabel: false })
    expect(wrapper.find('[role="button"]').exists()).toBe(false)
    expect(wrapper.find('[inert]').exists()).toBe(false)
  })

  it('names a header that has no visible title or language', () => {
    const wrapper = renderCodeBlock({ code: LONG_CODE, language: 'plaintext', title: '   ', isCollapsible: true })

    expect(wrapper.get('[role="button"]').attributes('aria-label')).toBe('Code')
  })

  it('keeps the copy control outside the disclosure control and does not toggle it', async () => {
    const wrapper = renderCodeBlock({ code: LONG_CODE, title: 'example.ts', isCollapsible: true })

    const control = wrapper.get('[role="button"]')
    expect(control.element.contains(copyButton(wrapper).element)).toBe(false)

    await copyButton(wrapper).trigger('click')
    await settle()

    expect(writeText).toHaveBeenCalledWith(LONG_CODE)
    expect(wrapper.get('[role="button"]').attributes('aria-expanded')).toBe('true')
  })

  it('paints a diff without taking the glyphs out of the copy or the syntax colors', async () => {
    const code = [
      '--- a/x.ts',
      '+++ b/x.ts',
      '@@ -1 +1 @@',
      '-const a = 1;',
      '+const b = 2;',
      ' plain',
      '---i;',
    ].join('\n')
    const wrapper = renderCodeBlock({
      code,
      language: 'typescript',
      isDiff: true,
      hasLineNumbers: true,
      highlightLines: [5],
      highlightMode: 'ranges',
    })

    expect(wrapper.get('.astryx-code-block-title').text()).toBe('typescript diff')
    expect(wrapper.get('.astryx-code-block__scroll').attributes('aria-label')).toBe('typescript diff')

    const rows = wrapper.findAll('[data-line]')
    expect(rows.map(row => row.attributes('data-diff'))).toEqual([
      'header',
      'header',
      'header',
      'removed',
      'added',
      undefined,
      'removed',
    ])
    expect(rows[2]?.get('.astryx-code-block__line-content').text()).toContain('@@')
    expect(rows[2]?.find('.astryx-token-keyword').exists()).toBe(false)
    expect(rows[3]?.get('.astryx-token-keyword').text()).toBe('const')
    expect(rows[3]?.get('[data-diff-marker]').text()).toBe('-')
    expect(rows[4]?.get('.astryx-token-keyword').text()).toBe('const')
    expect(rows[4]?.classes()).toContain('astryx-code-block__line--highlighted')
    expect(rows[5]?.get('[data-diff-marker]').element.textContent).toBe(' ')
    expect(rows[5]?.get('.astryx-code-block__line-content').text()).toBe('plain')
    expect(rows[6]?.attributes('data-diff')).toBe('removed')

    await copyButton(wrapper).trigger('click')
    await settle()
    expect(writeText).toHaveBeenCalledWith(code)
  })

  it('names a plaintext diff and keeps an unindented context line whole', () => {
    const wrapper = renderCodeBlock({
      code: 'diff --git a/x b/x\n+added\ncontext',
      language: 'plaintext',
      isDiff: true,
    })

    expect(wrapper.get('.astryx-code-block-title').text()).toBe('diff')
    expect(wrapper.get('.astryx-code-block__scroll').attributes('aria-label')).toBe('diff')
    const rows = wrapper.findAll('[data-line]')
    expect(rows[0]?.attributes('data-diff')).toBeUndefined()
    expect(rows[0]?.get('.astryx-code-block__line-content').text()).toBe('diff --git a/x b/x')
    expect(rows[2]?.get('.astryx-code-block__line-content').text()).toBe('context')
    expect(rows[2]?.get('[data-diff-marker]').element.textContent).toBe(' ')
  })
})
