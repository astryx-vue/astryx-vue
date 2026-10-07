<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { ButtonGroupProps, ButtonGroupSlots } from './types.js'
import { computed, onBeforeUnmount, onMounted, provide, useAttrs, useTemplateRef } from 'vue'
import { buttonGroupContextKey } from '../Button/context.js'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
import '../../styles/button-group.css'

defineOptions({
  name: 'ButtonGroup',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  elevation: 'none',
  isDisabled: false,
  orientation: 'horizontal',
  size: 'md',
})

defineSlots<ButtonGroupSlots>()

const attrs = useAttrs()
const element = useTemplateRef<HTMLDivElement>('root')
const orientation = computed(() => props.orientation)
const isDisabled = computed(() => props.isDisabled)
const size = computed(() => props.size)

provide(buttonGroupContextKey, {
  isDisabled,
  orientation,
  size,
})

const rootClass = computed(() => ['astryx-button-group', attrs.class])
const rootStyle = computed<StyleValue>(() => attrs.style as StyleValue)

const controlledAttrs = new Set([
  'aria-disabled',
  'aria-label',
  'class',
  'onKeyDown',
  'onKeydown',
  'style',
])

function getForwardedAttrs(): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)),
  )
}

function getItems(): HTMLElement[] {
  const root = element.value

  if (root == null)
    return []

  return Array.from(root.children).filter((child): child is HTMLElement =>
    child instanceof HTMLElement && child.classList.contains('astryx-button'),
  )
}

function isItemDisabled(item: HTMLElement): boolean {
  return item.getAttribute('aria-disabled') === 'true'
    || item.hasAttribute('disabled')
    || (item as HTMLButtonElement).disabled === true
}

function findEnabledIndex(
  items: HTMLElement[],
  start: number,
  step: 1 | -1,
  wrap: boolean,
): number {
  let index = start

  for (let visited = 0; visited < items.length; visited += 1) {
    if (index < 0 || index >= items.length) {
      if (!wrap)
        return -1

      index = (index + items.length) % items.length
    }

    const item = items[index]
    if (item != null && !isItemDisabled(item))
      return index

    index += step
  }

  return -1
}

function focusItem(items: HTMLElement[], index: number): void {
  items[index]?.focus()
}

function handleKeydown(event: KeyboardEvent): void {
  invokeNativeEventHandler(attrs.onKeydown ?? attrs.onKeyDown, event)

  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey)
    return

  if (event.key === 'Escape') {
    event.preventDefault()
    return
  }

  const items = getItems()
  if (items.length === 0)
    return

  const activeElement = typeof document === 'undefined' ? null : document.activeElement
  const currentIndex = items.findIndex(item => item === activeElement || item.contains(activeElement))
  const root = element.value
  const isRtl = root != null
    && typeof getComputedStyle !== 'undefined'
    && getComputedStyle(root).direction === 'rtl'
  const nextKey = props.orientation === 'horizontal'
    ? (isRtl ? 'ArrowLeft' : 'ArrowRight')
    : 'ArrowDown'
  const previousKey = props.orientation === 'horizontal'
    ? (isRtl ? 'ArrowRight' : 'ArrowLeft')
    : 'ArrowUp'
  let targetIndex = -1

  if (event.key === nextKey) {
    targetIndex = findEnabledIndex(items, currentIndex === -1 ? 0 : currentIndex + 1, 1, true)
  }
  else if (event.key === previousKey) {
    targetIndex = findEnabledIndex(items, currentIndex === -1 ? items.length - 1 : currentIndex - 1, -1, true)
  }
  else if (event.key === 'Home') {
    targetIndex = findEnabledIndex(items, 0, 1, false)
  }
  else if (event.key === 'End') {
    targetIndex = findEnabledIndex(items, items.length - 1, -1, false)
  }
  else {
    return
  }

  if (targetIndex !== -1)
    focusItem(items, targetIndex)

  event.preventDefault()
}

onMounted(() => {
  element.value?.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  element.value?.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  element,
})
</script>

<template>
  <div
    ref="root"
    v-bind="getForwardedAttrs()"
    :aria-disabled="isDisabled || undefined"
    :aria-label="label"
    :class="rootClass"
    :data-elevation="elevation"
    :data-orientation="orientation"
    :data-size="size"
    role="group"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>
