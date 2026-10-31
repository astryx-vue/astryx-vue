import type { LexicalEditor } from 'lexical'
import { buildEditorFromExtensions, defineExtension } from '@lexical/extension'
import { RichTextExtension } from '@lexical/rich-text'
import { mount } from '@vue/test-utils'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject, nextTick, provide, ref } from 'vue'
import { DEFAULT_NODES } from '../editorNodes.js'
import {
  $createRichTextExtensionNode,
  $isRichTextExtensionNode,
  setRichTextExtensionNodeDecorator,
} from '../markdownExtensionNode.js'
import { DecoratorTeleports } from './DecoratorTeleports.js'

const facts = { plugin: 'p', apiVersion: 1, name: 'n', display: 'inline' as const, data: null, source: ':x:' }

function build(): { editor: LexicalEditor, root: HTMLElement } {
  const editor = buildEditorFromExtensions(defineExtension({
    name: 'test',
    namespace: 'test',
    nodes: [...DEFAULT_NODES],
    dependencies: [RichTextExtension],
    onError(error: Error) { throw error },
  }))
  const root = document.createElement('div')
  root.contentEditable = 'true'
  document.body.append(root)
  editor.setRootElement(root)
  return { editor, root }
}

function write(editor: LexicalEditor, fill: () => void): Promise<void> {
  return new Promise(resolve => editor.update(fill, { onUpdate: resolve }))
}

describe('decoratorTeleports', () => {
  it('draws a decorator node into the element Lexical made for it', async () => {
    const { editor, root } = build()
    setRichTextExtensionNodeDecorator(editor, f => h('b', { class: 'drawn' }, `[${f.source}]`))
    const wrapper = mount(DecoratorTeleports, { props: { editor }, attachTo: document.body })
    await write(editor, () => {
      const p = $createParagraphNode()
      p.append($createTextNode('a '), $createRichTextExtensionNode(facts), $createTextNode(' b'))
      $getRoot().clear().append(p)
    })
    await nextTick()
    const host = root.querySelector('[data-lexical-decorator]')
    expect(host?.getAttribute('contenteditable')).toBe('false')
    expect(host?.querySelector('b.drawn')?.textContent).toBe('[:x:]')
    wrapper.unmount()
  })

  it('keeps provide/inject and reactivity working inside the node', async () => {
    const { editor, root } = build()
    const count = ref(1)
    const Inner = defineComponent({
      setup() {
        const label = inject<string>('label', 'missing')
        return () => h('i', `${label}:${count.value}`)
      },
    })
    setRichTextExtensionNodeDecorator(editor, () => h(Inner))
    const Host = defineComponent({
      setup() {
        provide('label', 'from-host')
        return () => h(DecoratorTeleports, { editor })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await write(editor, () => {
      $getRoot().clear().append($createParagraphNode().append($createRichTextExtensionNode(facts)))
    })
    await nextTick()
    expect(root.querySelector('i')?.textContent).toBe('from-host:1')
    count.value = 2
    await nextTick()
    expect(root.querySelector('i')?.textContent).toBe('from-host:2')
    wrapper.unmount()
  })

  it('removes the drawn content when the node is deleted', async () => {
    const { editor, root } = build()
    setRichTextExtensionNodeDecorator(editor, () => h('b', 'x'))
    const wrapper = mount(DecoratorTeleports, { props: { editor }, attachTo: document.body })
    await write(editor, () => {
      $getRoot().clear().append($createParagraphNode().append($createRichTextExtensionNode(facts)))
    })
    await nextTick()
    expect(root.querySelectorAll('b')).toHaveLength(1)
    await write(editor, () => {
      for (const child of $getRoot().getAllTextNodes()) child.remove()
      $getRoot().getFirstChildOrThrow<ReturnType<typeof $createParagraphNode>>().getChildren().forEach((n) => {
        if ($isRichTextExtensionNode(n))
          n.remove()
      })
    })
    await nextTick()
    expect(root.querySelectorAll('b')).toHaveLength(0)
    wrapper.unmount()
  })

  it('draws a node that was already in the editor before it mounted', async () => {
    const { editor, root } = build()
    setRichTextExtensionNodeDecorator(editor, () => h('b', 'early'))
    await write(editor, () => {
      $getRoot().clear().append($createParagraphNode().append($createRichTextExtensionNode(facts)))
    })
    const wrapper = mount(DecoratorTeleports, { props: { editor }, attachTo: document.body })
    await nextTick()
    expect(root.querySelector('b')?.textContent).toBe('early')
    wrapper.unmount()
  })
})
