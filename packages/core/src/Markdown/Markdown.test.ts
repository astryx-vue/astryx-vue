import type { MarkdownComponents } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, markRaw, nextTick, ref } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Markdown from './Markdown.vue'
import { markdownSourceLinesPlugin } from './plugin-protocol/sourceLines.js'

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
    expect(links.some(link => link.attributes('href') === 'https://example.com')).toBe(false)
    expect(wrapper.text()).toContain('https://example.com')

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
      // props 会被 VTU 包成响应式，组件定义要 markRaw，免得被一并代理。
      paragraph: markRaw(defineComponent({
        setup(_, { slots }) {
          return () => h('p', { class: 'custom-p' }, slots.default?.())
        },
      })),
      code: markRaw(defineComponent({
        props: { code: { type: String, required: true } },
        setup(props) {
          return () => h('pre', { class: 'custom-code' }, props.code)
        },
      })),
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
    expect(plain[0]?.attributes('style')).toContain('min-width')
  })

  it('turns a known source id into a citation chip and leaves unknown brackets as text', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: 'See Tokyo[abc1] and a literal [not-a-source].',
        sources: {
          abc1: { title: 'Tokyo - Wikipedia', url: 'https://en.wikipedia.org/wiki/Tokyo' },
        },
      },
    })
    const chip = wrapper.get('.astryx-markdown__cite')
    expect(chip.text()).toBe('Tokyo - Wikipedia')
    expect(chip.attributes('href')).toBe('https://en.wikipedia.org/wiki/Tokyo')
    expect(chip.attributes('data-citation-style')).toBe('label')
    expect(chip.attributes('aria-label')).toBe('Citation 1: Tokyo - Wikipedia')
    expect(wrapper.text()).toContain('[not-a-source]')
  })

  it('switches citations to a numbered badge and reuses the number', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: 'Tokyo[abc1] again[abc1] and Osaka[def2].',
        citationStyle: 'number',
        sources: {
          abc1: { title: 'Tokyo - Wikipedia', url: 'https://en.wikipedia.org/wiki/Tokyo' },
          def2: { title: 'Osaka' },
        },
      },
    })
    const chips = wrapper.findAll('.astryx-markdown__cite')
    expect(chips.map(chip => chip.text())).toEqual(['1', '1', '2'])
    expect(chips.map(chip => chip.attributes('data-citation-style'))).toEqual(['number', 'number', 'number'])
    expect(chips[0]?.attributes('aria-label')).toBe('Citation 1: Tokyo - Wikipedia')
    expect(chips[2]?.element.tagName).toBe('SPAN')
    expect(chips[2]?.attributes('href')).toBeUndefined()
  })

  it('links bare urls only when autolink is gfm, and leaves code and explicit links alone', () => {
    const source = [
      'See https://example.com/bare.',
      '',
      'Mail me at ada@example.com.',
      '',
      'Visit www.example.com/path.',
      '',
      'Angle <https://example.com/angle> stays.',
      '',
      'Code `https://example.com/code` stays.',
      '',
      'Explicit [docs](https://example.com/docs) stays.',
      '',
      'See (https://example.com/a_(b)) end.',
    ].join('\n')

    const plain = mount(Markdown, { props: { content: source } })
    expect(plain.find('a[href="https://example.com/bare"]').exists()).toBe(false)
    expect(plain.find('a[href="https://example.com/docs"]').exists()).toBe(true)
    expect(plain.find('a[href="mailto:ada@example.com"]').exists()).toBe(false)
    expect(plain.find('a[href="https://example.com/angle"]').exists()).toBe(true)
    expect(plain.text()).toContain('https://example.com/code')
    expect(plain.find('code').text()).toBe('https://example.com/code')

    const linked = mount(Markdown, { props: { content: source, autolink: 'gfm' } })
    const hrefs = linked.findAll('a.astryx-link').map(link => link.attributes('href'))
    expect(hrefs).toContain('https://example.com/bare')
    expect(hrefs).toContain('mailto:ada@example.com')
    expect(hrefs).toContain('http://www.example.com/path')
    expect(hrefs).toContain('https://example.com/angle')
    expect(hrefs.filter(href => href === 'https://example.com/docs')).toHaveLength(1)
    expect(hrefs).not.toContain('https://example.com/bare.')
    expect(linked.find('code').text()).toBe('https://example.com/code')
    expect(hrefs).toContain('https://example.com/a_(b)')
    expect(linked.text()).toContain('end.')
  })

  it('runs block and inline plugins on the ast and skips inline code', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: 'Hello @ada in `code @ada`.\n\nSee https://example.com/note.',
        autolink: 'gfm',
        plugins: [{
          name: 'note',
          transform(root) {
            return {
              ...root,
              children: [
                ...(root.children ?? []),
                { type: 'extension', plugin: 'note', name: 'banner', display: 'block', value: 'done' },
              ],
            }
          },
          render(node) {
            return h('aside', { class: 'note-banner' }, node.value ?? '')
          },
        }],
        inlinePlugins: [{
          name: 'mention',
          pattern: /@([a-z]+)/g,
          replace(match) {
            return {
              type: 'extension',
              plugin: 'mention',
              name: 'user',
              value: match[1],
            }
          },
          render(node) {
            return h('span', { 'class': 'mention', 'data-user': node.value }, `@${node.value ?? ''}`)
          },
        }],
      },
    })

    expect(wrapper.get('.mention').attributes('data-user')).toBe('ada')
    expect(wrapper.get('code').text()).toBe('code @ada')
    expect(wrapper.find('code .mention').exists()).toBe(false)
    expect(wrapper.get('.note-banner').text()).toBe('done')
    expect(wrapper.find('a[href="https://example.com/note"]').exists()).toBe(true)
  })

  it('maps a diff fence onto the code block diff layer', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: [
          '```diff-ts',
          '-const a = 1',
          '+const b = 2',
          '```',
        ].join('\n'),
      },
    })
    expect(wrapper.get('.astryx-code-block-title').text()).toBe('ts diff')
    const rows = wrapper.findAll('[data-line]')
    expect(rows.map(row => row.attributes('data-diff'))).toEqual(['removed', 'added'])
    expect(rows[0]?.get('.astryx-token-keyword').text()).toBe('const')
    expect(rows[1]?.get('.astryx-token-keyword').text()).toBe('const')
  })

  it('cycles list markers by nesting depth and keeps an ordered start', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: [
          '- Bullet at depth 0',
          '  1. Number at depth 1',
          '     - Bullet at depth 2',
          '',
          '26. Start 26',
        ].join('\n'),
      },
    })
    const lists = wrapper.findAll('.astryx-markdown__list')
    expect(lists.map(list => list.attributes('data-depth'))).toEqual(['0', '1', '2', '0'])
    expect(lists.map(list => list.attributes('data-marker'))).toEqual(['disc', 'lower-alpha', 'square', 'decimal'])
    expect(lists[1]?.element.tagName).toBe('OL')
    expect(lists[3]?.attributes('start')).toBe('26')
    expect(lists[3]?.attributes('style')).toContain('astryx-md-list 25')
    expect(wrapper.findAll('.astryx-markdown__marker-shape').map(shape => shape.attributes('data-shape'))).toEqual(['disc', 'square'])
    expect(wrapper.findAll('.astryx-markdown__item').every(item => item.element.tagName === 'LI')).toBe(true)
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

  it('decodes character references in prose and leaves them literal in a fence', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: [
          'Fish &amp; chips &copy; 2026',
          '',
          '```',
          '&copy;',
          '```',
        ].join('\n'),
      },
    })
    expect(wrapper.text()).toContain('Fish & chips © 2026')
    expect(wrapper.get('.astryx-code-block').text()).toContain('&copy;')
    expect(wrapper.find('[data-source-line]').exists()).toBe(false)
  })

  it('stamps source lines only when the source-lines plugin is passed', () => {
    const content = [
      '# Setup',
      '',
      'Paragraph with *em*.',
      '',
      '- item',
      '',
      '> Quote',
      '',
      '```ts',
      'const ready = true',
      '```',
      '',
      '| Name |',
      '| --- |',
      '| apples |',
      '',
      '---',
    ].join('\n')
    const wrapper = mount(Markdown, {
      props: { content, plugins: [markdownSourceLinesPlugin] },
    })
    expect(wrapper.get('h1').attributes('data-source-line')).toBe('1')
    expect(wrapper.get('h1').attributes('data-source-line-end')).toBe('1')
    expect(wrapper.get('[role="paragraph"]').attributes('data-source-line')).toBe('3')
    expect(wrapper.get('li').attributes('data-source-line')).toBeTruthy()
    expect(wrapper.get('blockquote').attributes('data-source-line')).toBeTruthy()
    expect(wrapper.get('.astryx-markdown__code').attributes('data-source-line')).toBeTruthy()
    expect(wrapper.get('.astryx-markdown__table-wrap').attributes('data-source-line')).toBeTruthy()
    expect(wrapper.get('hr').attributes('data-source-line')).toBeTruthy()
    expect(wrapper.get('em').attributes('data-source-line')).toBeUndefined()
    expect(wrapper.get('tr').attributes('data-source-line')).toBeUndefined()
    expect(wrapper.get('td').attributes('data-source-line')).toBeUndefined()
    expect(wrapper.get('th').attributes('data-source-line')).toBeUndefined()
    expect(wrapper.get('ul').attributes('data-source-line')).toBeUndefined()
  })

  it('wraps a long fenced line', () => {
    const wrapper = mount(Markdown, {
      props: {
        content: ['```', 'x'.repeat(90), '```'].join('\n'),
      },
    })
    expect(wrapper.get('.astryx-code-block__code').attributes('data-wrapped')).toBe('true')
  })
})
