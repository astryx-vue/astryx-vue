<script setup lang="ts">
import type { VNode } from 'vue'
import type { ChatReasoningEmits, ChatReasoningProps, ChatReasoningSlots } from './types.js'
import { computed, ref, useId, useSlots, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import ChatIcon from './ChatIcon.vue'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatReasoning', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<ChatReasoningProps, 'isExpanded'>>(), {
  isStreaming: false,
  defaultIsExpanded: false,
})
const emit = defineEmits<ChatReasoningEmits>()
defineSlots<ChatReasoningSlots>()
const slots = useSlots()
const messages = useAstryxMessages()
const model = defineModel<boolean | undefined>('isExpanded', { default: undefined })
const internalExpanded = ref(props.defaultIsExpanded)
const isExpanded = computed(() => model.value ?? internalExpanded.value)
const contentId = `astryx-chat-reasoning-${useId()}`
const root = useTemplateRef<HTMLDivElement>('root')
const heading = computed(() => props.label ?? messages.value.chat.thinking)

function slotPreview(): string | null {
  const nodes = slots.default?.()
  if (!nodes || nodes.length !== 1)
    return null
  const text = textOf(nodes[0]!)
  return text.trim() === '' ? null : text.trim()
}

function textOf(node: VNode): string {
  if (typeof node.children === 'string')
    return node.children
  return ''
}

function toggle(): void {
  const next = !isExpanded.value
  internalExpanded.value = next
  model.value = next
  emit('expandedChange', next)
}

defineExpose({ element: root })
</script>

<template>
  <div ref="root" v-bind="$attrs" class="astryx-chat-reasoning" :data-streaming="isStreaming || undefined" :data-open="isExpanded || undefined">
    <button
      type="button"
      class="astryx-chat-reasoning__header"
      :aria-expanded="isExpanded"
      :aria-controls="contentId"
      @click="toggle"
    >
      <span class="astryx-chat-reasoning__icon">
        <ChatIcon name="thinking" size="sm" />
      </span>
      <span class="astryx-chat-reasoning__label-row">
        <span class="astryx-chat-reasoning__label" :data-streaming="isStreaming || undefined">{{ heading }}</span>
        <template v-if="duration && !isStreaming">
          <span class="astryx-chat-reasoning__separator" aria-hidden="true">·</span>
          <span class="astryx-chat-reasoning__duration">{{ duration }}</span>
        </template>
        <template v-if="!isExpanded && !isStreaming && slotPreview()">
          <span class="astryx-chat-reasoning__separator" aria-hidden="true">—</span>
          <span class="astryx-chat-reasoning__preview">{{ slotPreview() }}</span>
        </template>
      </span>
      <span class="astryx-chat-tool-calls__chevron" :data-open="isExpanded || undefined">
        <Icon icon="chevronDown" size="xsm" color="inherit" />
      </span>
    </button>
    <div
      :id="contentId"
      class="astryx-chat-reasoning__panel"
      :data-open="isExpanded || undefined"
      :inert="!isExpanded"
    >
      <div class="astryx-chat-reasoning__panel-inner">
        <div class="astryx-chat-reasoning__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
