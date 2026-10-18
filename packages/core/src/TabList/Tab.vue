<script setup lang="ts">
import type { TabProps, TabSlots } from './types.js'
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  watch,
} from 'vue'

import { useLinkComponent } from '../LinkProvider/context.js'
import { tabListContextKey } from './context.js'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxTab' })

const props = withDefaults(defineProps<TabProps>(), {
  disabled: false,
  isLabelHidden: false,
})

defineSlots<TabSlots>()

const context = inject(tabListContextKey)
const linkComponent = useLinkComponent()
const rootRef = ref<HTMLElement>()

const isTabsPattern = computed(() => context?.isTabsPattern.value ?? false)
const isSelected = computed(() => context?.value.value === props.value)
const tabIndex = computed(() => (isSelected.value && !props.disabled ? 0 : -1))
const isLink = computed(() =>
  !isTabsPattern.value && props.href != null && props.href !== '' && !props.disabled,
)
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const root = computed(() => {
  if (isLink.value)
    return customLink.value == null ? 'a' : toRaw(customLink.value)
  return 'button'
})

const classes = computed(() => [
  'astryx-tab',
  `astryx-tab--size-${context?.size.value ?? 'md'}`,
  isSelected.value && 'astryx-tab--selected',
  props.disabled && 'astryx-tab--disabled',
  props.isLabelHidden && 'astryx-tab--label-hidden',
])

const isDev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV !== false
if (isDev && props.panelId != null && !isTabsPattern.value) {
  console.warn(
    'Tab: `panelId` only applies under the tabs pattern; give the TabList `role="tablist"` to wire up aria-controls.',
  )
}

function handleClick(): void {
  if (props.disabled || !context)
    return
  context.selectTab(props.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled || !context)
    return

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      context.moveFocus('next', props.value)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      context.moveFocus('prev', props.value)
      break
    case 'Home':
      event.preventDefault()
      context.moveFocus('first', props.value)
      break
    case 'End':
      event.preventDefault()
      context.moveFocus('last', props.value)
      break
  }
}

onMounted(() => {
  if (!context || !rootRef.value)
    return
  context.registerTab({
    value: props.value,
    disabled: props.disabled,
    el: rootRef.value,
  })
})

onUnmounted(() => {
  context?.unregisterTab(props.value)
})

watch(() => props.disabled, (disabled) => {
  if (!context || !rootRef.value)
    return
  context.registerTab({
    value: props.value,
    disabled,
    el: rootRef.value,
  })
})
</script>

<template>
  <component
    :is="root"
    :id="`astryx-tab-${value}`"
    ref="rootRef"
    :type="isLink ? undefined : 'button'"
    :role="isTabsPattern ? 'tab' : undefined"
    :class="classes"
    :href="isLink ? href : undefined"
    :to="isLink && customLink != null ? href : undefined"
    :aria-selected="isTabsPattern ? isSelected : undefined"
    :aria-current="isTabsPattern ? undefined : isSelected ? 'true' : undefined"
    :aria-controls="isTabsPattern ? panelId : undefined"
    :aria-label="isLabelHidden ? label : undefined"
    :tabindex="tabIndex"
    :disabled="isLink ? undefined : disabled"
    :data-selected="isSelected ? 'selected' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span
      v-if="$slots.icon || $slots.selectedIcon"
      class="astryx-tab__icon"
      aria-hidden="true"
    >
      <slot
        v-if="isSelected && $slots.selectedIcon"
        name="selectedIcon"
      />
      <slot
        v-else
        name="icon"
      />
    </span>
    <span
      class="astryx-tab__label"
      :class="{ 'astryx-visually-hidden': isLabelHidden }"
    >
      <span class="astryx-tab__label-text"><slot>{{ label }}</slot></span>
      <span
        v-if="!isLabelHidden"
        class="astryx-tab__label-sizer"
        aria-hidden="true"
      ><slot>{{ label }}</slot></span>
    </span>
    <span
      v-if="$slots.endContent"
      class="astryx-tab__end"
    >
      <slot name="endContent" />
    </span>
  </component>
</template>
