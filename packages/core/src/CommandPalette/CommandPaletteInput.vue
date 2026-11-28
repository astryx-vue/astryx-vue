<script setup lang="ts">
import type { CommandPaletteInputEmits, CommandPaletteInputProps } from './types.js'
import { computed, inject, onMounted, onScopeDispose, ref, useAttrs, useTemplateRef } from 'vue'
import { invokeNativeEventHandler } from '../Button/eventHandlers.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { getInteractionModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { DIALOG_CONTEXT_KEY } from '../Dialog/context.js'
import Icon from '../Icon/Icon.vue'
import { useComponentMessages } from '../locale/context.js'
import { commandPaletteMessages } from '../locale/messages/command-palette.js'
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
const messages = useComponentMessages({ commandPalette: commandPaletteMessages })
const inputRef = useTemplateRef<HTMLInputElement>('input')
const keyboardFocus = ref(false)
trackInteractionModality()

// 搜索转圈只是装饰；每次进入忙碌由输入框在对话框里念一次，面板拿到结果时再收回还没念出去的那一次。
const settleBusy = useBusyAnnouncement(() => palette?.isBusy.value === true, () => messages.value.commandPalette.loading, inputRef)
palette?.registerBusySettle(settleBusy)
onScopeDispose(() => palette?.registerBusySettle(null))

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
    'onFocus',
    'onBlur',
  ])
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !reserved.has(key)))
})
const shouldFocus = computed(() => props.hasAutoFocus && dialog?.isInline.value !== true)

function onFocus(event: FocusEvent): void {
  // 读输入框自己所在的 document：放在 iframe 或画中画窗口里时，那里的输入只到那里。
  const ownDocument = inputRef.value?.ownerDocument ?? document
  trackInteractionModality(ownDocument)
  keyboardFocus.value = getInteractionModality(ownDocument) === 'keyboard'
  invokeNativeEventHandler(attrs.onFocus, event)
}

function onBlur(event: FocusEvent): void {
  keyboardFocus.value = false
  invokeNativeEventHandler(attrs.onBlur, event)
}

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
      :data-keyboard-focus="keyboardFocus ? '' : undefined"
      type="text"
      autocorrect="off"
      enterkeyhint="search"
      :value="value"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeyDown"
    >
    <span class="astryx-command-palette-end">
      <Spinner v-if="palette?.isBusy.value" class="astryx-command-palette-spinner" size="sm" aria-hidden="true" />
      <slot name="end">
        <slot name="endContent" />
      </slot>
    </span>
  </div>
</template>
