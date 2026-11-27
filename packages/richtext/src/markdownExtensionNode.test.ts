import { createHeadlessEditor } from '@lexical/headless'
import { describe, expect, it } from 'vitest'
import { DEFAULT_NODES } from './editorNodes.js'
import { factsFrom, RichTextExtensionNode } from './markdownExtensionNode.js'

/** Runs `work` in an editor that registers this package's default nodes. */
function inEditor<T>(work: () => T): T {
  const editor = createHeadlessEditor({
    nodes: [...DEFAULT_NODES],
    onError(error) {
      throw error
    },
  })
  let result!: T
  editor.update(() => {
    result = work()
  }, { discrete: true })
  return result
}

describe('richTextExtensionNode construction', () => {
  // 协同编辑（Yjs）绑定会不带参数地建一个每个已注册节点类的实例，读它的默认属性。
  it('is constructible with no arguments', () => {
    expect(() => inEditor(() => new RichTextExtensionNode())).not.toThrow()
  })

  it('reads as empty facts, not as undefined', () => {
    const { facts, format } = inEditor(() => {
      const node = new RichTextExtensionNode()
      return { facts: node.getFacts(), format: node.getFormat() }
    })
    expect(facts).toEqual(factsFrom({}))
    expect(facts.display).toBe('inline')
    expect(format).toBe(0)
  })

  it('still takes the facts it is given', () => {
    const given = factsFrom({ display: 'block', name: 'chart', plugin: 'demo', source: '```chart\n```' })
    const { facts, format } = inEditor(() => {
      const node = new RichTextExtensionNode(given, 1)
      return { facts: node.getFacts(), format: node.getFormat() }
    })
    expect(facts.name).toBe('chart')
    // 块级节点不带文字格式，不管传了什么。
    expect(format).toBe(0)
  })
})
