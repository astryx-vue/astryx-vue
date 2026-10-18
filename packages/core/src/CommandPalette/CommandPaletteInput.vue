<script setup lang="ts">
import type { CommandPaletteInputEmits, CommandPaletteInputProps } from './types.js'
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

const emit = defineEmits<CommandPaletteInputEmits>()

defineSlots<{
  end?: () => unknown
  /** Same slot under the original prop name. */
  endContent?: () => unknown
}>()

const palette = inject(commandPaletteKey, null)
const dialog = inject(DIALOG_CONTEXT_KEY, null)
const messages = useAstryxMessages()
const inputRef = useTemplateRef<HTMLInputElement>('input')

const placeholder = computed(() => props.placeholder ?? messages.value.commandPalette.placeholder)
const label = computed(() => props.label ?? placeholder.value)
const value = computed(() => props.value ?? palette?.search.value ?? '')
const activeDescendant = computed(() => {
  const index = palette?.highlightedIndex.value ?? -1
  if (palette == null || index < 0)
    return undefined
  return `${palette.listId}-item-${index}`
})
const shouldFocus = computed(() => props.hasAutoFocus && dialog?.isInline.value !== true)

function onInput(event: Event): void {
  const next = (event.target as HTMLInputElement).value
  if (props.value == null) {
    palette?.setSearch(next)
    return
  }
  emit('valueChange', next)
  emit('update:value', next)
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
      <slot name="end">
        <slot name="endContent" />
      </slot>
    </span>
  </div>
</template>
