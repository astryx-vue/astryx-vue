<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { BaseTypeaheadProps, TypeaheadEmits, TypeaheadSlots } from './types.js'
import { computed, nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import Token from '../Token/Token.vue'
import TypeaheadMenu from './TypeaheadMenu.vue'
import { scrollOptionIntoView, useAnchoredListbox } from './useAnchoredListbox.js'
import { useTypeaheadMenu } from './useTypeaheadMenu.js'
import '../../styles/typeahead.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxBaseTypeahead', inheritAttrs: false })

const props = withDefaults(defineProps<BaseTypeaheadProps<T>>(), {
  modelValue: null,
  disabled: false,
  status: 'default',
  size: 'md',
  clearable: true,
  debounceMs: 150,
  maxMenuItems: 10,
  showOnFocus: false,
  required: false,
})

const emit = defineEmits<TypeaheadEmits<T>>()
defineSlots<TypeaheadSlots<T>>()

const messages = useAstryxMessages()
const generatedId = `astryx-typeahead-${useId()}`
const inputId = computed(() => props.inputId ?? generatedId)
const listboxId = computed(() => `${inputId.value}-listbox`)
const disabledId = computed(() => `${inputId.value}-disabled`)
const editing = ref(false)
let suppressFocusOpen = false
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')

const placeholder = computed(() => props.placeholder ?? messages.value.typeahead.placeholder)
const emptyText = computed(() => props.emptyText ?? messages.value.typeahead.empty)
const clearLabel = computed(() => messages.value.typeahead.clear)
const focusableDisabled = computed(() => props.disabled && Boolean(props.disabledReason?.trim()))

const menu = useTypeaheadMenu<T>({
  source: () => props.searchSource,
  debounceMs: () => props.debounceMs,
  showOnFocus: () => props.showOnFocus,
  maxItems: () => props.maxMenuItems,
  disabled: () => props.disabled,
  onSelect: (entry) => {
    commit(entry.item)
  },
  onEscape: () => {
    restoreSelection()
  },
  onQueryChange: (query) => {
    emit('search', query)
  },
})

const anchored = useAnchoredListbox({
  anchor: anchorRef,
  layer: listboxRef,
  isOpen: menu.combobox.isOpen,
  onDismiss: () => {
    menu.close()
    restoreSelection()
  },
})

const selected = computed(() => props.modelValue ?? null)
const showToken = computed(() => selected.value != null && !editing.value)
const describedBy = computed(() => {
  return [props.describedBy, focusableDisabled.value ? disabledId.value : undefined]
    .filter(Boolean)
    .join(' ') || undefined
})

watch(() => menu.combobox.isOpen.value, (isOpen) => {
  emit('openChange', isOpen)
})

watch(() => menu.combobox.activeIndex.value, (index) => {
  if (index < 0 || !menu.combobox.isOpen.value)
    return
  void nextTick(() => {
    scrollOptionIntoView(listboxRef.value, menu.entries.value[index]?.id)
  })
})

function commit(item: T | null): void {
  editing.value = false
  menu.query.value = ''
  menu.close()
  emit('update:modelValue', item)
  emit('change', item)
  // 选中后焦点留在输入框上，但不能马上再展开。否则 show-on-focus 会把刚收起的列表打开。
  suppressFocusOpen = item != null
  void nextTick(() => {
    inputRef.value?.focus()
    suppressFocusOpen = false
  })
}

function restoreSelection(): void {
  if (selected.value == null)
    return
  editing.value = false
  menu.query.value = ''
}

function startEdit(): void {
  if (props.disabled || selected.value == null || editing.value)
    return
  editing.value = true
  menu.setQuery(selected.value.label)
  void nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function highlight(index: number): void {
  const entry = menu.entries.value[index]
  if (entry && !entry.disabled)
    menu.combobox.activeIndex.value = index
}

function onInput(event: Event): void {
  if (props.disabled)
    return
  menu.setQuery((event.target as HTMLInputElement).value)
}

function onFocus(): void {
  if (props.disabled || suppressFocusOpen)
    return
  if (showToken.value) {
    startEdit()
    return
  }
  if (props.showOnFocus)
    menu.open()
}

function onBlur(event: FocusEvent): void {
  const next = event.relatedTarget
  if (next instanceof Node && (anchorRef.value?.contains(next) || listboxRef.value?.contains(next)))
    return
  menu.close()
  restoreSelection()
}

function onControlClick(event: MouseEvent): void {
  if (props.disabled)
    return
  const target = event.target
  if (target instanceof Element && target.closest('button, a'))
    return
  if (showToken.value)
    startEdit()
  else
    inputRef.value?.focus()
}

function onClear(event: MouseEvent): void {
  event.stopPropagation()
  commit(null)
}

function onMenuSelect(id: string): void {
  const entry = menu.entries.value.find(item => item.id === id)
  if (entry && !entry.disabled)
    commit(entry.item)
}

function optionSelected(id: string): boolean {
  return selected.value?.id === id
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<template>
  <div class="astryx-typeahead astryx-typeahead--bare" :class="[`size-${props.size}`]">
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是把焦点交给组合框；键盘用户直接 Tab 到输入框。 -->
    <div
      ref="anchorRef"
      class="astryx-typeahead-control"
      :class="[`status-${props.status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': props.disabled }]"
      @click="onControlClick"
    >
      <span v-if="$slots.icon" class="astryx-typeahead-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <Token
        v-if="showToken && selected"
        class="astryx-typeahead-value"
        :label="selected.label"
        :size="props.size"
        :disabled="props.disabled"
        @click="startEdit"
      />
      <input
        :id="inputId"
        ref="inputRef"
        class="astryx-typeahead-input"
        :class="{ 'is-hidden': showToken }"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        :placeholder="showToken ? undefined : placeholder"
        :value="showToken ? '' : menu.query.value"
        :disabled="props.disabled && !focusableDisabled"
        :readonly="focusableDisabled || undefined"
        :aria-disabled="focusableDisabled ? 'true' : undefined"
        :aria-expanded="menu.combobox.isOpen.value"
        :aria-controls="listboxId"
        :aria-label="props.label"
        aria-autocomplete="list"
        :aria-activedescendant="menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined"
        :aria-describedby="describedBy"
        :aria-required="props.required || undefined"
        :title="props.disabledReason"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="menu.onKeyDown"
      >
      <Spinner v-if="menu.status.value === 'loading'" class="astryx-typeahead-spinner" size="sm" :aria-label="messages.typeahead.loading" />
      <button
        v-if="props.clearable && selected && !props.disabled"
        type="button"
        class="astryx-typeahead-clear"
        :aria-label="clearLabel"
        @click="onClear"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <span v-if="focusableDisabled" :id="disabledId" class="astryx-visually-hidden">{{ props.disabledReason }}</span>
      <input v-if="props.name" type="hidden" :name="props.name" :value="selected?.id ?? ''">
    </div>
  </div>
  <Teleport to="body">
    <div
      v-show="menu.combobox.isOpen.value"
      :id="listboxId"
      ref="listboxRef"
      class="astryx-typeahead-listbox"
      role="listbox"
      :aria-label="messages.typeahead.results"
      :data-placement="anchored.position.value.placement"
      :style="anchored.style.value"
      tabindex="-1"
    >
      <TypeaheadMenu
        :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, selected: optionSelected(entry.item.id) }))"
        :active-index="menu.combobox.activeIndex.value"
        :status="menu.status.value"
        :listbox-id="listboxId"
        :empty-text="emptyText"
        :loading-text="messages.typeahead.loading"
        :error-text="messages.typeahead.error"
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
