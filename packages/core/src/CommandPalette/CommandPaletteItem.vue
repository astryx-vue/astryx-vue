<script setup lang="ts">
import type { CommandPaletteItemEmits, CommandPaletteItemProps } from './types.js'
import { computed, getCurrentInstance, inject, watch } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { commandPaletteKey } from './context.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteItem' })

const props = withDefaults(defineProps<CommandPaletteItemProps>(), {
  isDisabled: false,
})

const emit = defineEmits<CommandPaletteItemEmits>()

const palette = inject(commandPaletteKey, null)
const press = usePressFeedback({ hasOverlay: false })
const instance = getCurrentInstance()

/**
 * Vue turns an omitted boolean prop into `false`, so a `??` fallback cannot
 * tell "not passed" from "passed false". The vnode props can.
 */
function wasPassed(name: string): boolean {
  const vnodeProps = instance?.vnode.props
  if (vnodeProps == null)
    return false
  if (Object.hasOwn(vnodeProps, name))
    return true
  const kebab = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  return Object.hasOwn(vnodeProps, kebab)
}

const index = computed(() => palette?.items.value.findIndex(item => item.id === props.value) ?? -1)
const derivedHighlighted = computed(() => index.value >= 0 && palette?.highlightedIndex.value === index.value)
const derivedSelected = computed(() => palette?.value.value != null && palette.value.value === props.value)
/** An explicit prop wins; without it the state comes from the surrounding palette. */
const isHighlighted = computed(() => (wasPassed('isHighlighted') ? props.isHighlighted : derivedHighlighted.value))
const isSelected = computed(() => (wasPassed('isSelected') ? props.isSelected : derivedSelected.value))

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' && event.key !== ' ')
    return
  event.preventDefault()
  select()
}

function select(): void {
  if (props.isDisabled)
    return
  emit('select', props.value)
  if (palette == null || index.value < 0)
    return
  const item = palette.items.value[index.value]
  if (item != null)
    palette.selectItem(item)
}

function highlight(): void {
  if (!props.isDisabled && index.value >= 0)
    palette?.setHighlightedIndex(index.value, 'pointer')
}

function scrollIntoView(element: HTMLElement): void {
  element.scrollIntoView({ block: 'nearest' })
}

watch(isHighlighted, (highlighted, _previous, onCleanup) => {
  if (!highlighted || typeof document === 'undefined')
    return
  if (palette?.highlightCause.value === 'pointer')
    return
  if (palette?.highlightCause.value === 'sync' && palette.isInline.value)
    return
  const id = palette && index.value >= 0 ? `${palette.listId}-item-${index.value}` : undefined
  const element = id == null ? undefined : document.getElementById(id)
  const node = element ?? (instance?.vnode.el instanceof HTMLElement ? instance.vnode.el : null)
  if (node == null)
    return
  const frame = requestAnimationFrame(() => scrollIntoView(node))
  onCleanup(() => cancelAnimationFrame(frame))
})
</script>

<template>
  <div
    :id="index >= 0 && palette ? `${palette.listId}-item-${index}` : undefined"
    v-bind="press.pressableProps"
    class="astryx-command-palette-item"
    role="option"
    tabindex="-1"
    :aria-disabled="isDisabled || undefined"
    :aria-selected="isSelected"
    :data-disabled="isDisabled || undefined"
    :data-highlighted="isHighlighted || undefined"
    :data-selected="isSelected || undefined"
    :data-value="value"
    @click="select"
    @focus="highlight"
    @keydown="onKeyDown"
    @mouseenter="highlight"
  >
    <slot />
  </div>
</template>
