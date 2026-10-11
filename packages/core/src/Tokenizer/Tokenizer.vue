<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TokenizerChange, TokenizerEmits, TokenizerProps, TokenizerSlots } from './types.js'
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import { useOverflow } from '../composables/useOverflow.js'
import Field from '../Field/Field.vue'
import { useAstryxMessages } from '../locale/index.js'
import Token from '../Token/Token.vue'
import TypeaheadMenu from '../Typeahead/TypeaheadMenu.vue'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import '../../styles/typeahead.css'
import '../../styles/tokenizer.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxTokenizer', inheritAttrs: false })

const props = withDefaults(defineProps<TokenizerProps<T>>(), {
  modelValue: () => [],
  labelHidden: false,
  disabled: false,
  status: 'default',
  size: 'md',
  clearable: false,
  debounceMs: 150,
  maxMenuItems: 10,
  showOnFocus: false,
  creatable: false,
  overflow: 'none',
  required: false,
  optional: false,
})

const emit = defineEmits<TokenizerEmits<T>>()
defineSlots<TokenizerSlots<T>>()

const messages = useAstryxMessages()
const inputId = `astryx-tokenizer-${useId()}`
const listboxId = `${inputId}-listbox`
const disabledId = `${inputId}-disabled`
const values = computed(() => props.modelValue ?? [])
const focused = ref(false)
const placeholderHeight = ref(0)
const announcement = ref('')
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const tokenRowRef = useTemplateRef<HTMLElement>('tokenRowRef')
const tokenEls = new Map<number, HTMLElement>()

const placeholder = computed(() => props.placeholder ?? messages.value.tokenizer.placeholder)
const emptyText = computed(() => props.emptyText ?? messages.value.tokenizer.empty)
const focusableDisabled = computed(() => props.disabled && Boolean(props.disabledReason?.trim()))
const atMax = computed(() => props.maxEntries != null && values.value.length >= props.maxEntries)
const collapsed = computed(() => props.overflow !== 'none' && !focused.value)
const floating = computed(() => props.overflow === 'unfocused-layer' && focused.value)
const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  if (!props.statusMessage || props.status === 'default')
    return undefined
  return { type: props.status, message: props.statusMessage }
})
const describedBy = computed(() => {
  return [props.description ? `${inputId}-description` : undefined, props.statusMessage ? `${inputId}-status` : undefined, focusableDisabled.value ? disabledId : undefined].filter(Boolean).join(' ') || undefined
})

const menu = useTypeaheadMenu<T>({
  source: () => props.searchSource,
  debounceMs: () => props.debounceMs,
  showOnFocus: () => props.showOnFocus && !atMax.value,
  maxItems: () => props.maxMenuItems,
  disabled: () => props.disabled || atMax.value,
  excludeIds: () => values.value.map(item => item.id),
  blockedLabels: () => values.value.map(item => item.label),
  creatable: () => props.creatable && !atMax.value,
  createLabel: query => messages.value.tokenizer.create(query),
  onSelect: entry => add(entry.item, entry.create ? 'create' : 'add'),
  onQueryChange: query => emit('search', query),
})

const anchored = useAnchoredListbox({
  anchor: anchorRef,
  layer: listboxRef,
  isOpen: menu.combobox.isOpen,
  onDismiss: () => menu.close(),
})

const tokenCount = computed(() => values.value.length)
const overflow = useOverflow({
  container: tokenRowRef,
  count: tokenCount,
  enabled: collapsed,
})
const visibleCount = computed(() => collapsed.value ? overflow.visibleCount.value : values.value.length)

watch(() => menu.combobox.isOpen.value, (isOpen) => {
  emit('openChange', isOpen)
})

watch(() => menu.combobox.activeIndex.value, (index) => {
  if (!menu.combobox.isOpen.value || index < 0)
    return
  void nextTick(() => scrollOptionIntoView(listboxRef.value, menu.entries.value[index]?.id))
})

function announce(text: string): void {
  announcement.value = ''
  void nextTick(() => {
    announcement.value = text
  })
}

function commit(next: T[], change: TokenizerChange<T>): void {
  emit('update:modelValue', next)
  emit('change', next, change)
}

function add(item: T, type: 'add' | 'create'): void {
  if (props.disabled || atMax.value || values.value.some(entry => entry.id === item.id))
    return
  const next = [...values.value, item]
  commit(next, { type, item })
  announce(messages.value.tokenizer.added(item.label))
  menu.query.value = ''
  if (!props.showOnFocus)
    menu.close()
  void nextTick(() => inputRef.value?.focus())
}

function remove(item: T): void {
  if (props.disabled)
    return
  const next = values.value.filter(entry => entry.id !== item.id)
  commit(next, { type: 'remove', item })
  announce(messages.value.tokenizer.removed(item.label))
  void nextTick(() => inputRef.value?.focus())
}

function clearAll(event?: Event): void {
  event?.stopPropagation()
  if (props.disabled || values.value.length === 0)
    return
  commit([], { type: 'clear' })
  announce(messages.value.tokenizer.removed(values.value[values.value.length - 1]?.label ?? ''))
  menu.close()
  inputRef.value?.focus()
}

function setTokenEl(index: number, element: unknown): void {
  if (element instanceof HTMLElement)
    tokenEls.set(index, element)
  else
    tokenEls.delete(index)
}

function focusToken(index: number): void {
  void nextTick(() => tokenEls.get(index)?.focus())
}

function onInput(event: Event): void {
  if (props.disabled || atMax.value)
    return
  menu.setQuery((event.target as HTMLInputElement).value)
}

function onFocusIn(): void {
  if (!focused.value && props.overflow === 'unfocused-layer')
    placeholderHeight.value = anchorRef.value?.offsetHeight ?? 0
  focused.value = true
}

function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget
  if (next instanceof Node && (anchorRef.value?.contains(next) || listboxRef.value?.contains(next)))
    return
  focused.value = false
  menu.close()
}

function onInputKeyDown(event: KeyboardEvent): void {
  const input = inputRef.value
  if (event.key === 'Backspace' && menu.query.value === '' && values.value.length > 0) {
    event.preventDefault()
    const last = values.value[values.value.length - 1]
    if (last)
      remove(last)
    return
  }
  if (event.key === 'ArrowLeft' && input && input.selectionStart === 0 && input.selectionEnd === 0 && values.value.length > 0) {
    event.preventDefault()
    focusToken(values.value.length - 1)
    return
  }
  menu.onKeyDown(event)
}

function onTokenKeyDown(event: KeyboardEvent, item: T, index: number): void {
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    focusToken(index - 1)
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (index < values.value.length - 1)
      focusToken(index + 1)
    else
      inputRef.value?.focus()
  }
  else if (event.key === 'Escape') {
    inputRef.value?.focus()
  }
  else if (!props.disabled && (event.key === 'Backspace' || event.key === 'Delete')) {
    event.preventDefault()
    remove(item)
    if (index > 0)
      focusToken(index - 1)
  }
}

function onFieldClick(event: MouseEvent): void {
  if (props.disabled)
    return
  const target = event.target
  if (target instanceof Element && target.closest('button, a'))
    return
  inputRef.value?.focus()
}

function highlight(index: number): void {
  const entry = menu.entries.value[index]
  if (entry && !entry.disabled)
    menu.combobox.activeIndex.value = index
}

function onMenuSelect(id: string): void {
  const entry = menu.entries.value.find(item => item.id === id)
  if (!entry || entry.disabled)
    return
  add(entry.create ? entry.item : entry.item, entry.create ? 'create' : 'add')
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <Field
    class="astryx-tokenizer"
    :class="[`size-${props.size}`, { 'is-floating': floating }]"
    :label="props.label"
    :input-id="inputId"
    :description="props.description"
    :is-label-hidden="props.labelHidden"
    :is-disabled="props.disabled"
    :is-required="props.required"
    :is-optional="props.optional"
    :status="fieldStatus"
    :width="props.width"
  >
    <div v-if="floating" class="astryx-tokenizer-placeholder" :style="{ height: `${placeholderHeight}px` }" />
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是把焦点交给输入框；方向键和删除由输入框与标签处理。 -->
    <div
      ref="anchorRef"
      class="astryx-tokenizer-control"
      :class="[`status-${props.status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': props.disabled, 'is-floating': floating, 'has-tokens': values.length > 0 }]"
      @click="onFieldClick"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <span v-if="$slots.icon" class="astryx-tokenizer-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span
        ref="tokenRowRef"
        class="astryx-tokenizer-tokens"
        :class="{ 'is-collapsed': collapsed }"
      >
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键在标签容器上移动焦点，删除由内部按钮处理。 -->
        <span
          v-for="(item, index) in values"
          v-show="!collapsed || index < visibleCount"
          :key="item.id"
          :ref="element => setTokenEl(index, element)"
          class="astryx-tokenizer-token"
          data-overflow-item
          tabindex="-1"
          @keydown="onTokenKeyDown($event, item, index)"
        >
          <slot name="token" :item="item" :remove="() => remove(item)">
            <Token :label="item.label" :size="props.size" :disabled="props.disabled" removable @remove="remove(item)" />
          </slot>
        </span>
        <span v-show="collapsed && overflow.overflowCount.value > 0" class="astryx-tokenizer-more" data-overflow-indicator>
          {{ messages.tokenizer.more(overflow.overflowCount.value) }}
        </span>
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        class="astryx-tokenizer-input"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        :placeholder="values.length === 0 ? placeholder : undefined"
        :value="menu.query.value"
        :disabled="props.disabled && !focusableDisabled"
        :readonly="focusableDisabled || atMax || undefined"
        :aria-disabled="focusableDisabled ? 'true' : undefined"
        :aria-expanded="menu.combobox.isOpen.value"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        :aria-activedescendant="menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined"
        :aria-describedby="describedBy"
        :aria-required="props.required || undefined"
        :title="props.disabledReason"
        @input="onInput"
        @keydown="onInputKeyDown"
      >
      <slot name="end" />
      <button
        v-if="props.clearable && values.length > 0 && !props.disabled"
        type="button"
        class="astryx-tokenizer-clear"
        :aria-label="messages.tokenizer.clear"
        @click="clearAll"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <span v-if="focusableDisabled" :id="disabledId" class="astryx-visually-hidden">{{ props.disabledReason }}</span>
      <input v-for="item in values" :key="`${props.name}-${item.id}`" type="hidden" :name="props.name" :value="item.id" :disabled="!props.name">
    </div>
    <span class="astryx-visually-hidden" aria-live="polite">{{ announcement }}</span>
  </Field>
  <Teleport to="body">
    <div
      v-show="menu.combobox.isOpen.value"
      :id="listboxId"
      ref="listboxRef"
      class="astryx-typeahead-listbox"
      role="listbox"
      :aria-label="messages.tokenizer.results"
      :data-placement="anchored.position.value.placement"
      :style="anchored.style.value"
      tabindex="-1"
    >
      <TypeaheadMenu
        :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, selected: values.some(item => item.id === entry.item.id) }))"
        :active-index="menu.combobox.activeIndex.value"
        :status="menu.status.value"
        :listbox-id="listboxId"
        :empty-text="emptyText"
        :loading-text="messages.tokenizer.loading"
        :error-text="messages.tokenizer.error"
        @select="onMenuSelect"
        @highlight="highlight"
      >
        <template v-if="$slots.item" #item="slotProps">
          <slot
            name="item"
            :item="menu.entries.value.find(entry => entry.id === slotProps.entry.id)!.item"
            :is-active="slotProps.isActive"
            :is-selected="slotProps.isSelected"
          />
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </TypeaheadMenu>
    </div>
  </Teleport>
</template>
