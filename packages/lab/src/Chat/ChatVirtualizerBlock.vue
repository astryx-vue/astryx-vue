<script setup lang="ts" generic="T">
import type { RowEntry } from './chatVirtualizerRows.js'

// 装 spacer 和窗口里的行的内容块。自带容器和挂载模式共用这一块。
defineOptions({ name: 'AstryxChatVirtualizerBlock', inheritAttrs: false })

defineProps<{
  data: readonly T[]
  entries: readonly RowEntry[]
  bindContent: (el: unknown) => void
  bindTop: (el: unknown) => void
  bindBottom: (el: unknown) => void
  gapRefs: Record<'gapTop' | 'gapBottom' | 'gapTail', (el: unknown) => void>
  rowRef: (key: string) => (el: unknown) => void
  onFocusIn: (event: FocusEvent) => void
  onFocusOut: (event: FocusEvent) => void
}>()
defineSlots<{ default?: (props: { item: T, index: number }) => unknown }>()
</script>

<template>
  <div
    :ref="bindContent"
    v-bind="$attrs"
    class="astryx-chat-virtualizer__content"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div :ref="bindTop" aria-hidden="true" />
    <template v-for="entry in entries" :key="entry.kind === 'row' ? entry.key : `__${entry.name}`">
      <div v-if="entry.kind === 'row'" :ref="rowRef(entry.key)" :data-pkey="entry.key">
        <slot :item="data[entry.index] as T" :index="entry.index" />
      </div>
      <div v-else :ref="gapRefs[entry.name]" aria-hidden="true" />
    </template>
    <div :ref="bindBottom" aria-hidden="true" />
  </div>
</template>
