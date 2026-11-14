<script setup lang="ts">
import type { LightboxMedia, MarkdownInlinePlugin, MarkdownPlugin } from '@astryx-vue/core'
import type { CommentAgentCommand } from './types.js'
import { ChatTokenizedText, Lightbox, Markdown } from '@astryx-vue/core'
import { computed, defineComponent, h, provide, ref } from 'vue'
import { agentToken } from './agentToken.js'
import '../../styles/comment-thread.css'

defineOptions({ name: 'AstryxCommentMarkdown' })

const props = withDefaults(defineProps<{
  body: string
  agentCommands: readonly CommentAgentCommand[]
  plugins?: readonly MarkdownPlugin[]
  inlinePlugins?: readonly MarkdownInlinePlugin[]
}>(), {
  plugins: () => [],
  inlinePlugins: () => [],
})

const openedImage = ref<LightboxMedia | null>(null)
function openImage(media: LightboxMedia) {
  openedImage.value = media
}
provide('astryxCommentOpenImage', openImage)

const CommentImage = defineComponent({
  name: 'AstryxCommentMarkdownImage',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  setup(imageProps) {
    function open(event: Event): void {
      event.stopPropagation()
      if (event instanceof KeyboardEvent)
        event.preventDefault()
      openImage({ src: imageProps.src, alt: imageProps.alt })
    }
    function onKeydown(event: KeyboardEvent): void {
      if (event.key !== 'Enter' && event.key !== ' ')
        return
      open(event)
    }
    return () => h('img', {
      'src': imageProps.src,
      'alt': imageProps.alt,
      'role': 'button',
      'tabindex': 0,
      'aria-haspopup': 'dialog',
      'data-comment-image': 'lightbox',
      'class': 'astryx-comment-markdown-image',
      'onClick': open,
      onKeydown,
    })
  },
})

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const allInlinePlugins = computed<MarkdownInlinePlugin[]>(() => {
  const host = [...(props.inlinePlugins ?? [])]
  if (props.agentCommands.length === 0)
    return host
  const byCommand = new Map(props.agentCommands.map(agent => [agent.command, agent]))
  const pattern = new RegExp(
    `(^|\\s)/(${props.agentCommands.map(agent => escapeRegExp(agent.command)).join('|')})(?=\\s|$)`,
    'g',
  )
  host.push({
    name: 'comment-agent-command',
    pattern,
    replace: (match) => {
      const agent = byCommand.get(match[2] ?? '')
      if (agent == null)
        return null
      return {
        type: 'extension',
        plugin: 'comment-agent-command',
        name: 'agent-command',
        source: match[0],
        data: { prefix: match[1] ?? '', command: agent.command },
      }
    },
    render: (node) => {
      const command = String((node.data as { command?: string } | undefined)?.command ?? '')
      const prefix = String((node.data as { prefix?: string } | undefined)?.prefix ?? '')
      const agent = byCommand.get(command)
      if (agent == null)
        return node.source ?? ''
      const token = agentToken(agent)
      return h('span', { 'data-agent-command': agent.command }, [
        prefix,
        h(ChatTokenizedText, { tokens: [token], text: token.value }),
      ])
    },
  })
  return host
})

function onLightboxOpenChange(isOpen: boolean): void {
  if (!isOpen)
    openedImage.value = null
}
</script>

<template>
  <Markdown
    density="compact"
    :plugins="plugins"
    :inline-plugins="allInlinePlugins"
    autolink="gfm"
    :components="{ image: CommentImage }"
    :content="body"
  />
  <Lightbox
    v-if="openedImage != null"
    :is-open="true"
    :media="openedImage"
    has-zoom
    @open-change="onLightboxOpenChange"
  />
</template>
