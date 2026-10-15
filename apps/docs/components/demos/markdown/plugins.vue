<script setup lang="ts">
import type { MarkdownInlinePlugin, MarkdownPlugin } from '@astryx-vue/core/Markdown'
import { Markdown } from '@astryx-vue/core/Markdown'
import { defineComponent, h } from 'vue'

const NoteCallout = defineComponent({
  name: 'NoteCallout',
  props: {
    value: { type: String, default: '' },
  },
  setup(props) {
    return () => h('p', { class: 'markdown-plugin-note' }, props.value)
  },
})

const plugins: MarkdownPlugin[] = [{
  name: 'note',
  transform(root) {
    const children = (root.children ?? []).map((node) => {
      const text = node.children?.[0]
      if (node.type !== 'paragraph' || text?.type !== 'text' || !text.value?.startsWith('Note: '))
        return node
      return {
        type: 'extension',
        plugin: 'note',
        name: 'callout',
        display: 'block' as const,
        value: text.value.slice('Note: '.length),
      }
    })
    return { ...root, children }
  },
  render(node) {
    return h(NoteCallout, { value: node.value ?? '' })
  },
}]

const inlinePlugins: MarkdownInlinePlugin[] = [{
  name: 'mention',
  pattern: /@([A-Z]+)/gi,
  replace(match) {
    const name = match[1] ?? ''
    return {
      type: 'link',
      url: `https://example.com/people/${name}`,
      children: [{ type: 'text', value: `@${name}` }],
    }
  },
}]

const content = [
  'Note: a bare URL keeps its trailing period outside the link.',
  '',
  'Ask @Ada, then read https://example.com/notes.',
].join('\n')
</script>

<template>
  <Markdown
    :content="content"
    autolink="gfm"
    :inline-plugins="inlinePlugins"
    :plugins="plugins"
  />
</template>

<style scoped>
.markdown-plugin-note {
  margin: 0;
  padding-inline-start: 12px;
  border-inline-start: 2px solid var(--astryx-color-border, #ebebeb);
  color: var(--astryx-color-text-secondary, #525252);
}
</style>
