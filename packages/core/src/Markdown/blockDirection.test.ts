import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
