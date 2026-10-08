<script setup lang="ts">
import type { TabListProps, TabListTab } from './types.js'
import { computed, provide, reactive, ref } from 'vue'

import { tabListContextKey } from './context.js'
import '../../styles/tab-list.css'

const props = withDefaults(defineProps<TabListProps>(), {
  size: 'md',
  layout: 'hug',
  hasDivider: false,
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
}>()

defineSlots<{
  default: () => unknown
}>()

const tabs = reactive<TabListTab[]>([])
const focusedValue = ref(props.value)

const enabledTabs = computed(() => tabs.filter(tab => !tab.disabled))

function selectTab(value: string) {
  if (value === props.value)
    return
  emit('update:value', value)
  emit('change', value)
  focusedValue.value = value
}

function moveFocus(direction: 'next' | 'prev' | 'first' | 'last', value: string) {
  const stops = enabledTabs.value
  if (stops.length === 0)
    return

  const index = stops.findIndex(tab => tab.value === value)
  let nextIndex = index

  switch (direction) {
    case 'next':
      nextIndex = index >= 0 ? (index + 1) % stops.length : 0
      break
    case 'prev':
      nextIndex = index >= 0 ? (index - 1 + stops.length) % stops.length : stops.length - 1
      break
    case 'first':
      nextIndex = 0
      break
    case 'last':
      nextIndex = stops.length - 1
      break
  }

  const next = stops[nextIndex]
  if (!next)
    return

  focusedValue.value = next.value
  selectTab(next.value)
  next.el.focus()
}

function registerTab(tab: TabListTab) {
  const existingIndex = tabs.findIndex(t => t.value === tab.value)
  if (existingIndex >= 0) {
    tabs.splice(existingIndex, 1, tab)
  }
  else {
    tabs.push(tab)
  }
}

function unregisterTab(value: string) {
  const index = tabs.findIndex(t => t.value === value)
  if (index >= 0) {
    tabs.splice(index, 1)
  }
}

provide(tabListContextKey, {
  value: computed(() => props.value).value,
  size: props.size,
  layout: props.layout,
  hasDivider: props.hasDivider,
  tabs,
  focusedValue: computed(() => focusedValue.value).value,
  registerTab,
  unregisterTab,
  selectTab,
  moveFocus,
})
</script>

<template>
  <div
    class="astryx-tab-list"
    :class="[
      `astryx-tab-list--size-${size}`,
      `astryx-tab-list--layout-${layout}`,
      hasDivider && 'astryx-tab-list--has-divider',
    ]"
    role="tablist"
  >
    <div class="astryx-tab-list__strip">
      <slot />
    </div>
  </div>
</template>
