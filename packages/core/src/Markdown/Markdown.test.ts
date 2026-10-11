import type { MarkdownComponents } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Markdown from './Markdown.vue'

const sample = [
  '# Setup',
  '',
  'A **bold** _em_ ~~gone~~ note with `code` and [docs](https://example.com/docs).',
  '',
  'See https://example.com too.',
  '',
  '- [x] Done',
  '- [ ] Open',
  '',
  '1. first',
  '',
  'A separating paragraph.',
  '',
  '3. third',
  '',
  '> Quoted',
  '',
  '```ts',
  'const ready = true',
  '```',
  '',
  '| Name | Count |',
  '| --- | ---: |',
  '| apples | 2 |',
  '',
  '---',
  '',
  '![Alt text](https://example.com/a.png)',
  '',
].join('\n')

describe('markdown', () => {
  it('renders headings, emphasis, links, lists, quotes, code, tables, and rules', () => {
    const wrapper = mount(Markdown, { props: { content: sample } })

    expect(wrapper.attributes('role')).toBe('document')
    const headings = wrapper.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]?.attributes('id')).toBe('setup')
    expect(headings[0]?.find('a').attributes('href')).toBe('#setup')
    expect(wrapper.find('strong').text()).toBe('bold')
    expect(wrapper.find('em').text()).toBe('em')
    expect(wrapper.find('del').text()).toBe('gone')
    expect(wrapper.find('code.astryx-code').text()).toBe('code')

    const links = wrapper.findAll('a.astryx-link')
    expect(links[0]?.attributes('href')).toBe('https://example.com/docs')
    expect(links[0]?.attributes('target')).toBe('_blank')
    expect(links[0]?.attributes('rel')).toContain('noopener')
    expect(links.some(link => link.attributes('href') === 'https://example.com')).toBe(true)

    const tasks = wrapper.find('ul.astryx-markdown__tasks')
    expect(tasks.attributes('aria-label')).toBe('Task list')
    expect(tasks.findAll('[data-state]').map(node => node.attributes('data-state'))).toEqual(['checked', 'unchecked'])
    expect(tasks.text()).toContain('Completed')
    expect(tasks.text()).toContain('Not completed')

    expect(wrapper.findAll('ol')[0]?.attributes('start')).toBeUndefined()
    expect(wrapper.findAll('ol')[1]?.attributes('start')).toBe('3')
    expect(wrapper.find('blockquote').text()).toContain('Quoted')
    expect(wrapper.find('.astryx-code-block').text()).toContain('const ready = true')

    const cells = wrapper.findAll('.astryx-markdown__cell')
    expect(cells[0]?.attributes('data-align')).toBeUndefined()
    expect(cells[1]?.attributes('data-align')).toBe('right')
    expect(cells[2]?.attributes('data-align')).toBeUndefined()
    expect(cells[3]?.attributes('data-align')).toBe('right')
    expect(cells[1]?.attributes('scope')).toBe('col')
    expect(wrapper.find('hr').exists()).toBe(true)
    expect(wrapper.find('img').attributes()).toMatchObject({
      alt: 'Alt text',
      src: 'https://example.com/a.png',
    })
  })

  it('gives duplicate and chinese headings stable ids and shifts the heading level', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: '# Setup\n\n# Setup\n\n# 安装指南\n\n# \n',
        headingLevelStart: 2,
      },
    })
    const headings = wrapper.findAll('h2')
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(headings.map(heading => heading.attributes('id'))).toEqual([
      'setup',
      'setup-1',
      '安装指南',
      'section',
    ])
  })

  it('uses chinese task and heading labels from the locale', () => {
    const Host = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Markdown, { content: '# 安装\n\n- [x] 写完\n' })
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.astryx-markdown__anchor').attributes('aria-label')).toBe('安装的链接')
    expect(wrapper.find('.astryx-markdown__tasks').attributes('aria-label')).toBe('任务列表')
    expect(wrapper.text()).toContain('已完成')
  })

  it('drops unsafe links and images and keeps html as text', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: [
          'A [bad](javascript:alert(1)) link.',
          '',
          'A [hidden](java\u0000script:alert(1)) link.',
          '',
          'A [page](data:text/html,hi) link.',
          '',
          'See <script>alert(1)</script> now.',
          '',
          '![Icon](data:image/svg+xml,xxxx)',
          '',
        ].join('\n'),
      },
    })

    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('a[href^="javascript:"]').exists()).toBe(false)
    expect(wrapper.find('a[href^="data:"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('<script>alert(1)</script>')
    expect(wrapper.text()).toContain('Icon')
    expect(wrapper.text()).toContain('bad')
  })

  it('cancels navigation when onLinkClick returns false', async () => {
    const onLinkClick = vi.fn(() => false as const)
    const wrapper = mount(Markdown, {
      props: {
        content: '[Docs](/docs)\n',
        onLinkClick,
      },
    })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    wrapper.find('a').element.dispatchEvent(event)
    expect(onLinkClick).toHaveBeenCalledWith('/docs', event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('lets components replace a node kind', () => {
    const components: MarkdownComponents = {
      paragraph: defineComponent({
        setup(_, { slots }) {
          return () => h('p', { class: 'custom-p' }, slots.default?.())
        },
      }),
      code: defineComponent({
        props: { code: { type: String, required: true } },
        setup(props) {
          return () => h('pre', { class: 'custom-code' }, props.code)
        },
      }),
    }
    const wrapper = mount(Markdown, {
      props: {
        components,
        content: 'Hello\n\n```js\nconst n = 1\n```\n',
      },
    })
    expect(wrapper.find('p.custom-p').text()).toBe('Hello')
    expect(wrapper.find('pre.custom-code').text()).toBe('const n = 1')
    expect(wrapper.find('.astryx-code-block').exists()).toBe(false)
  })

  it('renders inline, compact, and measured prose', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: 'Hello `there`',
        contentWidth: 320,
        density: 'compact',
        display: 'inline',
      },
    })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('data-density')).toBe('compact')
    expect(wrapper.attributes('style')).toContain('--astryx-markdown-measure: 320px')
    expect(wrapper.find('span.astryx-markdown__paragraph').exists()).toBe(true)
  })

  it('reads the default slot when content is omitted', () => {
    const wrapper = mount(Markdown, { slots: { default: 'Hello **there**' } })
    expect(wrapper.find('strong').text()).toBe('there')
  })

  it('leaves unmarked columns on the default alignment and honors center markers', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: [
          '| A | B |',
          '| --- | --- |',
          '| one | two |',
          '',
          '| Left | Middle |',
          '| :--- | :---: |',
          '| start | center |',
        ].join('\n'),
      },
    })
    const tables = wrapper.findAll('table')
    const plain = tables[0]?.findAll('.astryx-markdown__cell') ?? []
    expect(plain.map(cell => cell.attributes('data-align'))).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    const marked = tables[1]?.findAll('.astryx-markdown__cell') ?? []
    expect(marked.map(cell => cell.attributes('data-align'))).toEqual([
      undefined,
      'center',
      undefined,
      'center',
    ])
  })

  describe('streaming', () => {
    it('keeps a settled heading node while later text arrives', async () => {
      const content = ref('# Hello\n\n')
      const Host = defineComponent({
        setup() {
          return () => h(Markdown, { content: content.value, isStreaming: true })
        },
      })
      const wrapper = mount(Host)
      expect(wrapper.attributes('data-streaming')).toBe('true')
      await nextTick()
      const heading = wrapper.find('h1').element
      expect(heading.textContent).toContain('Hello')

      content.value = '# Hello\n\nWorld keeps arriving while the heading stays put.\n'
      await nextTick()
      expect(wrapper.find('h1').element).toBe(heading)
      expect(wrapper.text()).toContain('World keeps arriving')
    })
  })
})
