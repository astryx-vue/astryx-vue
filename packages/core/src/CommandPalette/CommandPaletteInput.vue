<script setup lang="ts">
import type { CommandPaletteInputEmits, CommandPaletteInputProps } from './types.js'
import { computed, inject, onMounted, useAttrs, useTemplateRef } from 'vue'
import { DIALOG_CONTEXT_KEY } from '../Dialog/context.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import { commandPaletteKey } from './context.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPaletteInput', inheritAttrs: false })

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
const attrs = useAttrs()
const messages = useAstryxMessages()
const inputRef = useTemplateRef<HTMLInputElement>('input')

function hasAttr(name: string): boolean {
  return Object.hasOwn(attrs, name)
}

function attrText(name: string): string | undefined {
  const value = attrs[name]
  if (typeof value === 'string')
    return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  return undefined
}

const placeholder = computed(() => props.placeholder ?? messages.value.commandPalette.placeholder)
const label = computed(() => {
  const given = attrs['aria-label']
  return typeof given === 'string' && given !== '' ? given : (props.label ?? messages.value.commandPalette.inputLabel)
})
const value = computed(() => props.value ?? palette?.search.value ?? '')
const hasListbox = computed(() => (palette?.items.value.length ?? 0) > 0)
const callerOwnsPopup = computed(() => {
  if (palette != null)
    return false
  const popup = attrs['aria-haspopup']
  const declaresPopup = hasAttr('aria-haspopup') && popup !== false && popup !== 'false'
  return attrs.role === 'combobox'
    || hasAttr('aria-expanded')
    || hasAttr('aria-autocomplete')
    || hasAttr('aria-controls')
    || hasAttr('aria-owns')
    || hasAttr('aria-activedescendant')
    || declaresPopup
})
const role = computed(() => {
  if (palette != null)
    return 'combobox'
  if (hasAttr('role'))
    return attrText('role')
  return callerOwnsPopup.value ? 'combobox' : 'searchbox'
})
const expanded = computed(() => {
  const given = attrText('aria-expanded')
  const normalized = given === 'true' || given === 'false' ? given : undefined
  if (palette != null)
    return hasListbox.value ? 'true' : undefined
  if (hasAttr('aria-expanded'))
    return normalized
  return callerOwnsPopup.value ? 'true' : undefined
})
const autocomplete = computed(() => {
  if (palette != null)
    return 'list'
  const given = attrs['aria-autocomplete']
  if (given === 'none' || given === 'both' || given === 'inline' || given === 'list')
    return given
  return callerOwnsPopup.value ? 'list' : undefined
})
const controls = computed(() => {
  if (palette != null)
    return hasListbox.value ? palette.listId : undefined
  return attrText('aria-controls')
})
const activeDescendant = computed(() => {
  if (palette == null)
    return attrText('aria-activedescendant')
  const index = palette.highlightedIndex.value
  if (!hasListbox.value || index < 0)
    return undefined
  return `${palette.listId}-item-${index}`
})
const inputAttrs = computed(() => {
  const reserved = new Set([
    'class',
    'style',
    'role',
    'aria-label',
    'aria-expanded',
    'aria-autocomplete',
    'aria-controls',
    'aria-activedescendant',
    'onKeydown',
    'onKeyDown',
    'onInput',
  ])
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !reserved.has(key)))
})
const shouldFocus = computed(() => props.hasAutoFocus && dialog?.isInline.value !== true)

function onInput(event: Event): void {
  const caller = attrs.onInput
  if (typeof caller === 'function')
    (caller as (event: Event) => void)(event)
  const next = (event.target as HTMLInputElement).value
  if (props.value == null) {
    palette?.setSearch(next)
    return
  }
  emit('valueChange', next)
  emit('update:value', next)
}

function onKeyDown(event: KeyboardEvent): void {
  const caller = attrs.onKeydown ?? attrs.onKeyDown
  if (typeof caller === 'function')
    (caller as (event: KeyboardEvent) => void)(event)
  if (event.defaultPrevented || event.isComposing || event.key === 'Process')
    return
  palette?.onKeyDown(event)
}

onMounted(() => {
  if (shouldFocus.value)
    requestAnimationFrame(() => inputRef.value?.focus())
})
</script>

<template>
  <div class="astryx-command-palette-input" :class="attrs.class" :style="attrs.style">
    <Icon class="astryx-command-palette-search" icon="search" size="sm" />
    <input
      v-bind="inputAttrs"
      ref="input"
      :aria-activedescendant="activeDescendant"
      :aria-autocomplete="autocomplete"
      :aria-controls="controls"
      :aria-expanded="expanded"
      :aria-label="label"
      class="astryx-command-palette-field"
      :placeholder="placeholder"
      :role="role"
      type="text"
      :value="value"
      @input="onInput"
      @keydown="onKeyDown"
    >
    <span class="astryx-command-palette-end">
      <Spinner v-if="palette?.isBusy.value" class="astryx-command-palette-spinner" size="sm" />
      <slot name="end">
        <slot name="endContent" />
      </slot>
    </span>
  </div>
</template>
