<script setup lang="ts">
import type { ChatToolCallItem, ChatToolCallsEmits, ChatToolCallsProps, ChatToolCallsSlots } from './types.js'
import { computed, ref, useId, useSlots, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import ChatIcon from './ChatIcon.vue'
import ChatStatusMark from './ChatStatusMark.vue'
import ChatToolCallRow from './ChatToolCallRow.vue'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatToolCalls', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<ChatToolCallsProps, 'isExpanded'>>(), {
  defaultIsExpanded: false,
})
const emit = defineEmits<ChatToolCallsEmits>()
defineSlots<ChatToolCallsSlots>()
const slots = useSlots()
const messages = useAstryxMessages()
const model = defineModel<boolean | undefined>('isExpanded', { default: undefined })
const internalExpanded = ref(props.defaultIsExpanded)
const isExpanded = computed(() => model.value ?? internalExpanded.value)
const contentId = `astryx-chat-tool-calls-${useId()}`
const root = useTemplateRef<HTMLDivElement>('root')

const summary = computed(() => props.label ?? messages.value.chat.toolGroup(props.calls.length))
const latest = computed(() => props.calls[props.calls.length - 1])
const single = computed(() => props.calls.length === 1 ? props.calls[0] : undefined)

function toggle(): void {
  const next = !isExpanded.value
  internalExpanded.value = next
  model.value = next
  emit('expandedChange', next)
}

function rowKey(call: ChatToolCallItem, index: number): string {
  return call.key ?? `${call.name}\u001F${call.target ?? ''}\u001F${call.node ?? ''}\u001F${index}`
}

function expandable(call: ChatToolCallItem): boolean {
  return Boolean(call.detail) || Boolean(slots.detail)
}

defineExpose({ element: root })
</script>

<template>
  <div v-if="calls.length" ref="root" v-bind="$attrs" class="astryx-chat-tool-calls">
    <ChatToolCallRow v-if="single" :call="single" :expandable="expandable(single)">
      <template v-if="expandable(single)" #detail>
        <slot name="detail" :call="single">
          {{ single.detail }}
        </slot>
      </template>
    </ChatToolCallRow>

    <template v-else>
      <button
        type="button"
        class="astryx-chat-tool-calls__row"
        :aria-expanded="isExpanded"
        :aria-controls="contentId"
        @click="toggle"
      >
        <template v-if="isExpanded">
          <span class="astryx-chat-tool-calls__group-icon">
            <ChatIcon name="wrench" size="sm" />
          </span>
          <span class="astryx-chat-tool-calls__group-label">{{ summary }}</span>
        </template>
        <template v-else-if="latest">
          <ChatStatusMark :status="latest.status ?? 'complete'" :error-message="latest.errorMessage" />
          <span class="astryx-chat-tool-calls__name">{{ latest.name }}</span>
          <span v-if="latest.target" class="astryx-chat-tool-calls__target">{{ latest.target }}</span>
        </template>
        <span class="astryx-chat-tool-calls__count">
          <template v-if="!isExpanded">
            <ChatIcon name="wrench" size="xsm" />
            {{ calls.length }}
          </template>
        </span>
        <span class="astryx-chat-tool-calls__chevron" :data-open="isExpanded || undefined">
          <Icon icon="chevronDown" size="xsm" color="inherit" />
        </span>
      </button>
      <div
        :id="contentId"
        class="astryx-chat-tool-calls__panel"
        :data-open="isExpanded || undefined"
        :inert="!isExpanded"
      >
        <div class="astryx-chat-tool-calls__panel-inner">
          <div class="astryx-chat-tool-calls__list">
            <ChatToolCallRow
              v-for="(call, index) in calls"
              :key="rowKey(call, index)"
              :call="call"
              :expandable="expandable(call)"
            >
              <template v-if="expandable(call)" #detail>
                <slot name="detail" :call="call">
                  {{ call.detail }}
                </slot>
              </template>
            </ChatToolCallRow>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
