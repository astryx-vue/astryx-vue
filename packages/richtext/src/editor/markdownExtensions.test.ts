import type { MarkdownExtensionNode, MarkdownSyntaxPluginDefinition } from '@astryx-vue/core/Markdown/plugins'
import { createMarkdownPlugin } from '@astryx-vue/core/Markdown/plugins'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { createRichTextExtension, markdownToEditorStateJSON, RichTextExtensionError } from '../markdown.js'
import { DEFAULT_TRANSFORMERS } from '../markdownTable.js'
import { deriveExtensionNode } from './plugins/MarkdownExtensionsPlugin.js'
import RichTextEditor from './RichTextEditor.vue'
import RichTextView from './RichTextView.vue'

type MentionNode = MarkdownExtensionNode<'mentions', 'mention', { readonly label: string }, 'inline'>

const definition: MarkdownSyntaxPluginDefinition<'mentions', MentionNode> = {
  name: 'mentions',
  apiVersion: 1,
  parseKey: 'v1',
  syntax: {
    inline: [{
      startsWith: ['@{'],
      maxSpan: 80,
      tokenize({ source, offset, end }) {
        const close = source.indexOf('}', offset + 2)
        if (close < 0 || close >= end)
          return { status: 'no-match' }
        return {
          status: 'match',
          end: close + 1,
          node: { type: 'extension', plugin: 'mentions', name: 'mention', display: 'inline', data: { label: source.slice(offset + 2, close) } },
        }
      },
    }],
  },
  renderers: {
    // 画成一个 <b>，测试里好找。
    mention: { render: ({ node }) => h('b', { class: 'mention' }, `@${node.data.label}`), toText: node => `@${node.data.label}` },
  },
}
const mentions = createMarkdownPlugin<'mentions', MentionNode>(definition)
const extension = createRichTextExtension(mentions)
const stored = markdownToEditorStateJSON('hi @{ada} there\n', { extensions: [extension] })

const mounted: Array<{ unmount: () => void }> = []
afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  document.body.innerHTML = ''
})
async function settle(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 40))
  await nextTick()
  await nextTick()
}

describe('markdown extension nodes in a view', () => {
  it('draws a plugin node with the plugin renderer when the plugin is given', async () => {
    const wrapper = mount(RichTextView, { props: { value: stored, markdownExtensions: [extension] }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.get('b.mention').text()).toBe('@ada')
  })

  it('shows the source when the plugin is not given', async () => {
    const wrapper = mount(RichTextView, { props: { value: stored }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.find('b.mention').exists()).toBe(false)
    expect(wrapper.text()).toContain('@{ada}')
  })
})

describe('markdown extension nodes in an editor', () => {
  it('draws the node and still exports its exact source', async () => {
    const wrapper = mount(RichTextEditor, { props: { label: 'Notes', defaultValue: stored, markdownExtensions: [extension] }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.get('b.mention').text()).toBe('@ada')
    expect((wrapper.vm as unknown as { getMarkdown: () => string }).getMarkdown().trim()).toBe('hi @{ada} there')
  })

  it('selects the whole node on click and rings it', async () => {
    const wrapper = mount(RichTextEditor, { props: { label: 'Notes', defaultValue: stored, markdownExtensions: [extension] }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    const host = wrapper.get('b.mention').element.closest('[data-markdown-extension]') as HTMLElement
    host.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await settle()
    expect(host.classList.contains('astryx-richtext__selected')).toBe(true)
  })

  it('stops drawing the node when the extension is removed', async () => {
    const wrapper = mount(RichTextEditor, { props: { label: 'Notes', defaultValue: stored, markdownExtensions: [extension] }, attachTo: document.body })
    mounted.push(wrapper)
    await settle()
    expect(wrapper.find('b.mention').exists()).toBe(true)
    await wrapper.setProps({ markdownExtensions: [] })
    await settle()
    expect(wrapper.find('b.mention').exists()).toBe(false)
  })

  it('refuses the same plugin adopted twice', () => {
    expect(() => mount(RichTextEditor, { props: { label: 'Notes', markdownExtensions: [extension, extension], transformers: DEFAULT_TRANSFORMERS } })).toThrow(RichTextExtensionError)
  })
})

describe('deriveExtensionNode', () => {
  it('re-reads a node from its source with the adopted plugin', () => {
    const facts = { plugin: 'mentions', apiVersion: 1, name: 'mention', display: 'inline' as const, data: null, source: '@{ada}' }
    expect(deriveExtensionNode(facts, [mentions])?.name).toBe('mention')
  })

  it('returns null when the plugin is missing, a different version, or reads the source as something else', () => {
    const facts = { plugin: 'mentions', apiVersion: 1, name: 'mention', display: 'inline' as const, data: null, source: '@{ada}' }
    expect(deriveExtensionNode(facts, [])).toBeNull()
    expect(deriveExtensionNode({ ...facts, apiVersion: 2 }, [mentions])).toBeNull()
    expect(deriveExtensionNode({ ...facts, source: 'plain text' }, [mentions])).toBeNull()
  })
})
