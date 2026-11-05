import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Markdown from './Markdown.vue'

const { parse, parseIncremental } = vi.hoisted(() => ({
  parse: vi.fn(),
  parseIncremental: vi.fn(),
}))

vi.mock('./parse.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('./parse.js')>()
  parse.mockImplementation(original.parseMarkdown)
  parseIncremental.mockImplementation(original.parseMarkdownIncremental)
  return { ...original, parseMarkdown: parse, parseMarkdownIncremental: parseIncremental }
})

beforeEach(() => {
  parse.mockClear()
  parseIncremental.mockClear()
})

describe('markdown 无变化重渲染', () => {
  it('只改容器对齐时复用解析结果，内容变化才重新解析', async () => {
    const wrapper = mount(Markdown, { props: { content: '# Heading', contentAlign: 'start' } })
    expect(parse).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Heading')

    await wrapper.setProps({ contentAlign: 'center' })
    expect(parse).toHaveBeenCalledTimes(1)
    expect(wrapper.get('.astryx-markdown').attributes('data-align')).toBe('center')

    await wrapper.setProps({ content: '# Next' })
    expect(parse).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Next')
  })

  it('streaming 的无关容器变化也不重新解析', async () => {
    const wrapper = mount(Markdown, {
      props: { content: 'Hello', isStreaming: true, contentAlign: 'start' },
    })
    expect(parseIncremental).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ contentAlign: 'center' })
    expect(parseIncremental).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ content: 'Hello world' })
    expect(parseIncremental).toHaveBeenCalledTimes(2)
  })

  it('链接回调变化不会留下旧的点击处理', async () => {
    const first = vi.fn(() => false as const)
    const second = vi.fn(() => false as const)
    const wrapper = mount(Markdown, {
      props: { content: '[Docs](https://example.com)', onLinkClick: first },
    })
    await wrapper.get('a').trigger('click')
    expect(first).toHaveBeenCalledOnce()

    await wrapper.setProps({ onLinkClick: second })
    await wrapper.get('a').trigger('click')
    expect(second).toHaveBeenCalledOnce()
  })
})
