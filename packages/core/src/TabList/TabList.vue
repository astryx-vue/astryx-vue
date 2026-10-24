<script setup lang="ts">
import type { TabListProps, TabListTab } from './types.js'
import { computed, provide, reactive, ref } from 'vue'

import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import { tabListContextKey } from './context.js'
import { useTabListScroll } from './useTabListScroll.js'
import '../../styles/tab-list.css'

const props = withDefaults(defineProps<TabListProps>(), {
  size: 'md',
  layout: 'hug',
  hasDivider: false,
  isFullBleed: false,
  overflow: 'auto',
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
}>()

defineSlots<{
  default: () => unknown
}>()

const bleedsInline = computed(() =>
  props.edgeCompensation === 'inline' || (props.edgeCompensation == null && props.isFullBleed),
)
const scrolls = computed(() => props.overflow !== 'visible')
const {
  bind: bindStrip,
  onFocusIn: onStripFocusIn,
  overflowEnd,
  overflowStart,
  scrollByPage,
} = useTabListScroll({
  enabled: scrolls,
  selectedValue: computed(() => props.value),
})

/** `role="tablist"` switches the strip from a nav landmark to the tabs pattern. */
const isTabsPattern = computed(() => props.role === 'tablist')
const rootTag = computed(() => (props.role == null ? 'nav' : 'div'))

const messages = useAstryxMessages()
/** 导航模式的标签条是个 landmark，没有名字读屏没法区分；调用方用 `aria-label` 覆盖。 */
const defaultLabel = computed(() => props.role == null ? messages.value.tabList.label : undefined)

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
  if (next.selectsOnFocus !== false)
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
  value: computed(() => props.value),
  size: computed(() => props.size),
  layout: computed(() => props.layout),
  hasDivider: computed(() => props.hasDivider),
  isTabsPattern,
  tabs,
  focusedValue,
  registerTab,
  unregisterTab,
  selectTab,
  moveFocus,
})
</script>

<template>
  <component
    :is="rootTag"
    class="astryx-tab-list"
    :class="[
      `astryx-tab-list--size-${size}`,
      `astryx-tab-list--layout-${layout}`,
      hasDivider && 'astryx-tab-list--has-divider',
      bleedsInline && 'astryx-tab-list--full-bleed',
    ]"
    :role="role"
    :aria-label="defaultLabel"
    @focusin="onStripFocusIn"
  >
    <div
      :ref="bindStrip"
      class="astryx-tab-list__strip"
      :class="{
        'astryx-tab-list__strip--scroll': scrolls,
        'astryx-tab-list__strip--fade-both': scrolls && overflowStart && overflowEnd,
        'astryx-tab-list__strip--fade-start': scrolls && overflowStart && !overflowEnd,
        'astryx-tab-list__strip--fade-end': scrolls && overflowEnd && !overflowStart,
      }"
    >
      <slot />
    </div>
    <button
      v-if="scrolls && overflowStart"
      type="button"
      class="astryx-tab-scroll-button astryx-tab-scroll-button--start"
      aria-hidden="true"
      tabindex="-1"
      @mousedown.prevent
      @click="scrollByPage(-1)"
    >
      <Icon class="astryx-tab-scroll-button__icon" icon="chevronLeft" size="sm" />
    </button>
    <button
      v-if="scrolls && overflowEnd"
      type="button"
      class="astryx-tab-scroll-button astryx-tab-scroll-button--end"
      aria-hidden="true"
      tabindex="-1"
      @mousedown.prevent
      @click="scrollByPage(1)"
    >
      <Icon class="astryx-tab-scroll-button__icon" icon="chevronRight" size="sm" />
    </button>
  </component>
</template>
