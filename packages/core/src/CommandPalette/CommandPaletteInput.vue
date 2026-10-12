<script setup lang="ts">
import type { CommandPaletteInputProps } from './types.js'
import { computed, inject, onMounted, useTemplateRef } from 'vue'
import { DIALOG_CONTEXT_KEY } from '../Dialog/context.js'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { commandPaletteKey } from './context.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteInput' })

const props = withDefaults(defineProps<CommandPaletteInputProps>(), {
  hasAutoFocus: true,
})

const palette = inject(commandPaletteKey, null)
const dialog = inject(DIALOG_CONTEXT_KEY, null)
const messages = useAstryxMessages()
const inputRef = useTemplateRef<HTMLInputElement>('input')

const placeholder = computed(() => props.placeholder ?? messages.value.commandPalette.placeholder)
const label = computed(() => props.label ?? placeholder.value)
const value = computed(() => palette?.search.value ?? '')
const activeDescendant = computed(() => {
  const index = palette?.highlightedIndex.value ?? -1
  if (palette == null || index < 0)
    return undefined
  return `${palette.listId}-item-${index}`
})
const shouldFocus = computed(() => props.hasAutoFocus && dialog?.isInline.value !== true)

function onInput(event: Event): void {
  palette?.setSearch((event.target as HTMLInputElement).value)
}

onMounted(() => {
  if (shouldFocus.value)
    requestAnimationFrame(() => inputRef.value?.focus())
})
</script>

<template>
  <div class="astryx-command-palette-input">
    <span class="astryx-command-palette-search" aria-hidden="true" />
    <input
      ref="input"
      :aria-activedescendant="activeDescendant"
      aria-autocomplete="list"
      :aria-controls="palette?.listId"
      :aria-expanded="palette ? true : undefined"
      :aria-label="label"
      class="astryx-command-palette-field"
      :placeholder="placeholder"
      role="combobox"
      type="text"
      :value="value"
      @input="onInput"
      @keydown="palette?.onKeyDown"
    >
    <span class="astryx-command-palette-end">
      <Spinner v-if="palette?.isBusy.value" class="astryx-command-palette-spinner" size="sm" />
      <slot name="end" />
    </span>
  </div>
</template>
