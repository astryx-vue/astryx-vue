import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { firstStrongDirection, markdownBlockDirection } from './blockDirection.js'
import Markdown from './Markdown.vue'

describe('firstStrongDirection', () => {
  it.each([
    ['hello', 'ltr'],
    ['שלום', 'rtl'],
    ['مرحبا', 'rtl'],
    ['123 שלום', 'rtl'],
    ['(שלום)', 'rtl'],
    ['日本語', 'ltr'],
    ['٣٤ abc', 'ltr'],
    ['\u200Fabc', 'rtl'],
    ['\u05B0\u05D0', 'rtl'],
  ])('reads %j as %s', (text, direction) => {
    expect(firstStrongDirection(text)).toBe(direction)
  })

  it.each(['', '123', '!?.', '   ', '\u{1F600}'])('finds no direction in %j', (text) => {
    expect(firstStrongDirection(text)).toBeNull()
  })
})

describe('markdownBlockDirection', () => {
  it('skips an image, code and a citation when it reads a block', () => {
    const node = { type: 'listItem', children: [
      { type: 'paragraph', children: [{ type: 'image', url: 'a.png', alt: 'English caption' }] },
      { type: 'code', value: 'English code' },
      { type: 'paragraph', children: [{ type: 'text', value: 'שלום' }] },
    ] }
    expect(markdownBlockDirection(node)).toBe('rtl')
  })
})

describe('markdown 每一块按自己文字的方向排', () => {
  function dirs(content: string, selector: string): Array<string | null> {
    const wrapper = mount(Markdown, { props: { content } })
    return wrapper.findAll(selector).map(element => element.attributes('dir') ?? null)
  }

  it('段落按自己第一个强方向字符定方向', () => {
    expect(dirs('English paragraph\n\nשלום עולם\n\nمرحبا بالعالم', '.astryx-markdown__paragraph')).toEqual(['ltr', 'rtl', 'rtl'])
  })

  it('只有数字、标点或图片的段落不写方向，沿用外面的', () => {
    expect(dirs('2024 !!!\n\n![English caption](https://example.com/a.png)', '.astryx-markdown__paragraph')).toEqual([null, null])
  })

  it('标题、引用、列表项和表格单元格各按自己的文字', () => {
    expect(dirs('# שלום', '.astryx-markdown__heading')).toEqual(['rtl'])
    expect(dirs('> שלום', '.astryx-markdown__blockquote')).toEqual(['rtl'])
    expect(dirs('- hello\n- שלום', '.astryx-markdown__item')).toEqual(['ltr', 'rtl'])
    expect(dirs('- [ ] שלום', '.astryx-markdown__task')).toEqual(['rtl'])
    expect(dirs('| a | ב |\n| - | - |\n| 1 | שלום |', '.astryx-markdown__cell')).toEqual(['ltr', 'rtl', null, 'rtl'])
  })
})

describe('没有强方向字符的块按外层 provider 的方向', () => {
  function mountIn(dir: 'ltr' | 'rtl', content: string) {
    return mount({
      components: { InternationalizationProvider, Markdown },
      setup: () => ({ dir, content }),
      template: '<InternationalizationProvider locale="en" :dir="dir"><Markdown :content="content" /></InternationalizationProvider>',
    })
  }

  function paragraphDirs(wrapper: ReturnType<typeof mountIn>, selector: string): Array<string | null> {
    return wrapper.findAll(`${selector} .astryx-markdown__paragraph`).map(paragraph => paragraph.attributes('dir') ?? null)
  }

  it('从右到左的列表项里，只有数字的段落在从左到右的页面里读作从左到右', () => {
    const wrapper = mountIn('ltr', '- שלום עולם\n\n  2026')
    expect(wrapper.find('.astryx-markdown__item').attributes('dir')).toBe('rtl')
    expect(paragraphDirs(wrapper, '.astryx-markdown__item')).toEqual(['rtl', 'ltr'])
  })

  it('从左到右的引用里，只有数字的段落在从右到左的页面里读作从右到左', () => {
    expect(paragraphDirs(mountIn('rtl', '> hello\n>\n> 2026'), '.astryx-markdown__blockquote')).toEqual(['ltr', 'rtl'])
  })

  it('外面那一块和页面同向时不写方向', () => {
    expect(paragraphDirs(mountIn('ltr', '> hello\n>\n> 2026'), '.astryx-markdown__blockquote')).toEqual(['ltr', null])
  })

  it('读向和表格相反的单元格标出来，显式的左对齐也写出，好按表格的方向摆', () => {
    const wrapper = mountIn('ltr', '| a | ב |\n| :- | -: |\n| שלום | x |')
    const cells = wrapper.findAll('.astryx-markdown__cell').map(cell => ({
      against: cell.attributes('data-against-table') != null,
      align: cell.attributes('data-align') ?? null,
    }))
    expect(cells).toEqual([
      { against: false, align: null },
      { against: true, align: 'right' },
      { against: true, align: 'left' },
      { against: false, align: 'right' },
    ])
  })
})
