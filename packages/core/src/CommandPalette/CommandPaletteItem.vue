<script setup lang="ts">
import type { CommandPaletteItemProps } from './types.js'
import { computed, inject, onMounted, watch } from 'vue'
import { commandPaletteKey } from './context.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteItem' })

const props = withDefaults(defineProps<CommandPaletteItemProps>(), {
  isDisabled: false,
})

const palette = inject(commandPaletteKey, null)

const index = computed(() => palette?.items.value.findIndex(item => item.id === props.value) ?? -1)
const isHighlighted = computed(() => index.value >= 0 && palette?.highlightedIndex.value === index.value)
const isSelected = computed(() => palette?.value.value != null && palette.value.value === props.value)

function select(): void {
  if (props.isDisabled || palette == null || index.value < 0)
    return
  const item = palette.items.value[index.value]
  if (item != null)
    palette.selectItem(item)
}

function highlight(): void {
  if (!props.isDisabled && index.value >= 0)
    palette?.setHighlightedIndex(index.value)
}

function scrollIntoView(element: Element): void {
  if (!(element instanceof HTMLElement))
    return
  if (palette?.isInline.value && palette.highlightedIndex.value === index.value && index.value === 0)
    return
  element.scrollIntoView({ block: 'nearest' })
}

onMounted(() => {
  // The first highlighted row in an inline preview stays put.
})

watch(isHighlighted, (highlighted, _previous, onCleanup) => {
  if (!highlighted)
    return
  const id = `${palette?.listId}-item-${index.value}`
  const element = document.getElementById(id)
  if (element == null)
    return
  const frame = requestAnimationFrame(() => scrollIntoView(element))
  onCleanup(() => cancelAnimationFrame(frame))
})
</script>

<template>
  <div
    :id="index >= 0 && palette ? `${palette.listId}-item-${index}` : undefined"
    class="astryx-command-palette-item"
    role="option"
    :aria-disabled="isDisabled || undefined"
    :aria-selected="isSelected"
    :data-disabled="isDisabled || undefined"
    :data-highlighted="isHighlighted || undefined"
    :data-selected="isSelected || undefined"
    :data-value="value"
    @click="select"
    @mouseenter="highlight"
  >
    <slot />
  </div>
</template>
