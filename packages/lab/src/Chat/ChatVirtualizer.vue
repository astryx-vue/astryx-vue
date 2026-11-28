<script setup lang="ts" generic="T">
import type { ChatVirtualizerProps, ChatVirtualizerSlots } from './chatVirtualizerTypes.js'
import { chatMessages, useComponentMessages, useScrollableArea } from '@astryx-vue/core'
import { computed } from 'vue'
import ChatVirtualizerBlock from './ChatVirtualizerBlock.vue'
import { useChatVirtualizer } from './useChatVirtualizer.js'
import '../../styles/chat-virtualizer.css'

defineOptions({ name: 'AstryxChatVirtualizer', inheritAttrs: false })

const props = defineProps<ChatVirtualizerProps<T>>()
defineSlots<ChatVirtualizerSlots<T>>()

const messages = useComponentMessages({ chat: chatMessages })
const label = computed(() => props.label ?? messages.value.chat.virtualizerLabel)
// 自带容器：键盘用户能聚焦并滚动它，是一个用 label 命名的 group。它始终是滚动容器，
// 列表写 scrollTop 时内容还没溢出也能生效。
const area = useScrollableArea({
  axis: 'block',
  stickyContainment: 'always',
  get keyboardAccess() {
    return { owner: 'viewport' as const, label: label.value }
  },
})

const virtualizer = useChatVirtualizer(props)
const { isAttach, entries, rowRef, gapRefs, onFocusIn, onFocusOut, bindTop, bindBottom } = virtualizer

function bindViewport(el: unknown): void {
  area.viewport(el)
  virtualizer.bindOwnScroller(el)
}
function bindContent(el: unknown): void {
  virtualizer.bindContent(el)
  if (!isAttach.value)
    area.content.value = el instanceof HTMLElement ? el : null
}

defineExpose(virtualizer.expose)
</script>

<template>
  <ChatVirtualizerBlock
    v-if="isAttach"
    v-bind="$attrs"
    :data="data"
    :entries="entries"
    :bind-content="bindContent"
    :bind-top="bindTop"
    :bind-bottom="bindBottom"
    :gap-refs="gapRefs"
    :row-ref="rowRef"
    :on-focus-in="onFocusIn"
    :on-focus-out="onFocusOut"
  >
    <template #default="row">
      <slot v-bind="row" />
    </template>
  </ChatVirtualizerBlock>
  <div
    v-else
    :ref="bindViewport"
    v-bind="{ ...$attrs, ...area.viewportAttrs.value }"
    class="astryx-chat-virtualizer"
    :style="area.viewportStyle.value"
  >
    <ChatVirtualizerBlock
      :data="data"
      :entries="entries"
      :bind-content="bindContent"
      :bind-top="bindTop"
      :bind-bottom="bindBottom"
      :gap-refs="gapRefs"
      :row-ref="rowRef"
      :on-focus-in="onFocusIn"
      :on-focus-out="onFocusOut"
    >
      <template #default="row">
        <slot v-bind="row" />
      </template>
    </ChatVirtualizerBlock>
  </div>
</template>
