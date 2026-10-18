<script setup lang="ts">
import type { ChatComposerToken, ChatTokenizedTextProps, ChatTokenizedTextSlots } from './types.js'
import { useSlots } from 'vue'
import ChatTokenContent from './ChatTokenContent.vue'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatTokenizedText', inheritAttrs: false })

const props = defineProps<ChatTokenizedTextProps>()
defineSlots<ChatTokenizedTextSlots>()
const slots = useSlots()

interface TextPart {
  key: string
  text?: string
  token?: ChatComposerToken
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Text of the default slot. Only plain strings contribute; other content is ignored. */
function slotText(): string {
  const nodes = slots.default?.()
  if (!nodes)
    return ''
  return nodes.map(node => typeof node.children === 'string' ? node.children : '').join('')
}

/**
 * Splits the message into plain runs and token runs. Built during render so a
 * new slot value from the parent re-splits on the same tick.
 */
function buildParts(): TextPart[] {
  const text = props.text ?? slotText()
  const tokens = (props.tokens ?? []).filter(token => token.value.length > 0)
  if (text.length === 0 || tokens.length === 0)
    return [{ key: 'all', text }]

  const map = new Map<string, ChatComposerToken>()
  for (const token of tokens) {
    if (!map.has(token.value))
      map.set(token.value, token)
  }
  const pattern = [...map.keys()].map(escapeRegExp).join('|')
  const regex = new RegExp(`(${pattern})`, 'g')
  const rendered: TextPart[] = []
  let last = 0
  let match = regex.exec(text)
  let index = 0
  while (match) {
    if (match.index > last)
      rendered.push({ key: `t-${index}`, text: text.slice(last, match.index) })
    const token = map.get(match[0])
    if (token)
      rendered.push({ key: `${match[0]}-${match.index}`, token })
    last = match.index + match[0].length
    index += 1
    match = regex.exec(text)
  }
  if (last < text.length)
    rendered.push({ key: 'tail', text: text.slice(last) })
  return rendered
}
</script>

<template>
  <span v-bind="$attrs" class="astryx-chat-tokenized">
    <template v-for="part in buildParts()" :key="part.key">
      <span v-if="part.token" class="astryx-chat-token">
        <ChatTokenContent :token="part.token" />
      </span>
      <template v-else>{{ part.text }}</template>
    </template>
  </span>
</template>
