import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { parseOutlineFromMarkdown } from './parseOutlineFromMarkdown.js'
import { useOutlineFromDOM } from './useOutlineFromDOM.js'
import { useOutlineFromMarkdown } from './useOutlineFromMarkdown.js'

describe('parseOutlineFromMarkdown', () => {
  it('returns an empty outline when there are no headings', () => {
    expect(parseOutlineFromMarkdown('just a paragraph of text')).toEqual([])
    expect(parseOutlineFromMarkdown('')).toEqual([])
  })

  it('slugifies the heading and keeps its level', () => {
    expect(parseOutlineFromMarkdown('# Getting Started')).toEqual([
      { id: 'getting-started', label: 'Getting Started', level: 1 },
    ])
    expect(parseOutlineFromMarkdown(['# One', '## Two', '### Three'].join('\n\n')).map(item => item.level)).toEqual([1, 2, 3])
  })

  it('strips quotes, flattens inline marks, and ignores a fenced heading', () => {
    expect(parseOutlineFromMarkdown('# The "Best" Way')[0]?.id).toBe('the-best-way')
    expect(parseOutlineFromMarkdown('# **Bold** and _italic_ text')[0]).toMatchObject({
      id: 'bold-and-italic-text',
      label: 'Bold and italic text',
    })
    expect(parseOutlineFromMarkdown('# The `useState` hook')[0]?.label).toBe('The useState hook')
    const fenced = ['# Real Heading', '', '```', '# not a heading', '```'].join('\n')
    expect(parseOutlineFromMarkdown(fenced).map(item => item.label)).toEqual(['Real Heading'])
  })

  it('deduplicates ids and lets a nested heading consume one', () => {
    expect(parseOutlineFromMarkdown(['# Setup', '# Setup', '# Setup'].join('\n\n')).map(item => item.id)).toEqual(['setup', 'setup-1', 'setup-2'])
    expect(parseOutlineFromMarkdown(['# !!!', '# @@@'].join('\n\n')).map(item => item.id)).toEqual(['section', 'section-1'])
    expect(parseOutlineFromMarkdown('> # Quoted\n\n# Quoted')).toEqual([
      { id: 'quoted-1', label: 'Quoted', level: 1 },
    ])
  })

  it('follows the markdown string inside a component', async () => {
    const source = ref('# Overview')
    const Host = defineComponent({
      setup() {
        const items = useOutlineFromMarkdown(source)
        return { items }
      },
      template: '<p>{{ items.map(item => item.id).join(",") }}</p>',
    })
    const wrapper = mount(Host)
    expect(wrapper.text()).toBe('overview')
    source.value = '# Overview\n\n# Overview'
    await nextTick()
    expect(wrapper.text()).toBe('overview,overview-1')
  })
})

describe('useOutlineFromDOM', () => {
  it('reads headings that have an id and a label', async () => {
    const Host = defineComponent({
      setup() {
        const container = ref<HTMLElement | null>(null)
        const items = useOutlineFromDOM(container)
        return { container, items }
      },
      template: '<div ref="container"><h2 id="alpha">Alpha</h2><h3>Skipped</h3><p>{{ items.map(item => item.id + item.level).join(",") }}</p></div>',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(wrapper.text()).toContain('alpha2')
    wrapper.unmount()
  })
})
