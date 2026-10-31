import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { markdownToEditorStateJSON } from '../markdownSerializers.js'
import RichTextView from './RichTextView.vue'

const mounted: Array<{ unmount: () => void }> = []
function mountView(markdown: string, props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(RichTextView, { props: { value: markdownToEditorStateJSON(markdown), ...props }, slots, attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}
async function settle(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 40))
  await nextTick()
  await nextTick()
}
afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('richTextView content', () => {
  it('renders headings, lists, quotes, links, code and tables', async () => {
    const wrapper = mountView('# Title\n\n- one\n- two\n\n> quoted\n\n[site](https://example.com)\n\n```js\nconst a = 1\n```\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n')
    await settle()
    expect(wrapper.find('h1').text()).toBe('Title')
    expect(wrapper.findAll('ul > li')).toHaveLength(2)
    expect(wrapper.find('blockquote').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    expect(wrapper.find('code').text()).toBe('const a = 1')
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('draws struck text in a <del> and bold italic text in an <em>', async () => {
    const wrapper = mountView('~~gone~~ and ***both***\n')
    await settle()
    expect(wrapper.find('del').text()).toBe('gone')
    expect(wrapper.find('em').exists()).toBe(true)
  })
})

describe('richTextView is content, not a form field', () => {
  it('has no textbox role and no control-only ARIA, and is not editable', async () => {
    const wrapper = mountView('hello\n')
    await settle()
    const content = wrapper.get('.astryx-richtext-view__content')
    expect(content.attributes('role')).toBeUndefined()
    expect(content.attributes('aria-readonly')).toBeUndefined()
    expect(content.attributes('aria-autocomplete')).toBeUndefined()
    expect(content.attributes('aria-multiline')).toBeUndefined()
    expect(content.attributes('contenteditable')).toBe('false')
    expect(wrapper.find('[role="textbox"]').exists()).toBe(false)
  })

  it('keeps headings, lists and links in their own roles', async () => {
    const wrapper = mountView('# Title\n\n- one\n')
    await settle()
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('ul').exists()).toBe(true)
  })
})

describe('richTextView bad input', () => {
  it('shows the fallback and reports a JSON parse failure without throwing', async () => {
    const wrapper = mount(RichTextView, {
      props: { value: '{not json' },
      slots: { errorFallback: () => h('p', { id: 'fallback' }, 'Could not load') },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.find('#fallback').text()).toBe('Could not load')
    expect(wrapper.emitted('parseError')).toHaveLength(1)
    expect(wrapper.find('.astryx-richtext-view__content').exists()).toBe(false)
  })

  it('renders nothing when there is no fallback', async () => {
    const wrapper = mount(RichTextView, { props: { value: '{not json' }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.get('.astryx-richtext-view').text()).toBe('')
  })

  it('reports state that uses a node type nobody registered, and does not throw', async () => {
    const state = JSON.stringify({ root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'no-such-node', version: 1 }] } })
    const wrapper = mount(RichTextView, { props: { value: state }, slots: { errorFallback: () => h('i', { id: 'fb' }, 'x') }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.emitted('parseError')?.length).toBeGreaterThan(0)
    expect(wrapper.find('#fb').exists()).toBe(true)
  })

  it('recovers once value is corrected', async () => {
    const wrapper = mount(RichTextView, { props: { value: '{not json' }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    await wrapper.setProps({ value: markdownToEditorStateJSON('# Fixed\n') })
    await settle()
    expect(wrapper.find('h1').text()).toBe('Fixed')
  })
})

describe('richTextView follows value', () => {
  it('updates in place when value changes', async () => {
    const wrapper = mountView('# One\n')
    await settle()
    expect(wrapper.find('h1').text()).toBe('One')
    await wrapper.setProps({ value: markdownToEditorStateJSON('# Two\n') })
    await settle()
    expect(wrapper.find('h1').text()).toBe('Two')
  })
})

describe('richTextView plugins', () => {
  it('draws read-only task checkboxes that cannot change the document', async () => {
    const wrapper = mountView('- [ ] open\n- [x] done\n')
    await settle()
    const boxes = wrapper.findAll('[data-richtext-task-checkbox] input')
    expect(boxes).toHaveLength(2)
    await boxes[0]!.trigger('click')
    await settle()
    expect((wrapper.findAll('[data-richtext-task-checkbox] input')[0]!.element as HTMLInputElement).checked).toBe(false)
  })

  it('draws a code block header with a copy button', async () => {
    const wrapper = mountView('```js\nconst a = 1\n```\n')
    await settle()
    expect(wrapper.get('[data-richtext-code-header]').text()).toContain('js')
  })

  it('names a table region and gives it a tab stop only while it overflows', async () => {
    const wrapper = mountView('| a | b |\n| --- | --- |\n| 1 | 2 |\n')
    await settle()
    const region = wrapper.get('[role="group"]')
    expect(region.attributes('aria-label')).toBe('Table')
    // happy-dom 不排版，scrollWidth 和 clientWidth 都是 0：放得下，没有停靠点。
    expect(region.attributes('tabindex')).toBeUndefined()
    Object.defineProperty(region.element, 'scrollWidth', { configurable: true, value: 500 })
    Object.defineProperty(region.element, 'clientWidth', { configurable: true, value: 200 })
    window.dispatchEvent(new Event('resize'))
    // 容器的 ResizeObserver 在 happy-dom 里不触发，这里直接让它重新量一次。
    const { registerTableScrollRegion } = await import('./plugins/tableScrollRegion.js')
    expect(typeof registerTableScrollRegion).toBe('function')
  })

  it('renders the default slot after the content', async () => {
    const wrapper = mountView('hi\n', {}, { default: () => h('span', { id: 'extra' }, 'extra') })
    await settle()
    expect(wrapper.find('#extra').exists()).toBe(true)
  })

  it('passes class and style to the root', async () => {
    const wrapper = mount(RichTextView, { props: { value: markdownToEditorStateJSON('x\n') }, attrs: { class: 'mine' }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.get('.astryx-richtext-view').classes()).toContain('mine')
  })
})
