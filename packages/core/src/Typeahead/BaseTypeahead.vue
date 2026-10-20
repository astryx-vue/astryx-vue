<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { BaseTypeaheadProps, TypeaheadEmits, TypeaheadSlots } from './types.js'
import { computed, inject, nextTick, onMounted, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import Token from '../Token/Token.vue'
import { typeaheadChromeKey } from './context.js'
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
  minQueryLength: 1,
  showOnFocus: false,
  hasAutoFocus: false,
  required: false,
})

const emit = defineEmits<TypeaheadEmits<T>>()
defineSlots<TypeaheadSlots<T>>()

const attrs = useAttrs()
const messages = useAstryxMessages()
const generatedId = `astryx-typeahead-${useId()}`
const inputId = computed(() => props.inputId ?? generatedId)
const listboxId = computed(() => `${inputId.value}-listbox`)
const disabledId = computed(() => `${inputId.value}-disabled`)
const disabledTooltipId = computed(() => `${inputId.value}-disabled-tooltip`)
const editing = ref(false)
let suppressFocusOpen = false
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const controlRef = useTemplateRef<HTMLElement>('controlRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')

const placeholder = computed(() => props.placeholder ?? messages.value.typeahead.placeholder)
const emptyText = computed(() => props.emptySearchText ?? props.emptyText ?? messages.value.typeahead.empty)
const clearLabel = computed(() => messages.value.typeahead.clear)
/** 新名 hasEntriesOnFocus 和旧名 showOnFocus 任一为真就生效。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
const focusableDisabled = computed(() => Boolean(props.isFocusableDisabled) || (props.disabled && Boolean(props.disabledReason?.trim())))
/** 有禁用原因时鼠标悬停或键盘聚焦都能读到它。 */
const showsDisabledMessage = computed(() => Boolean(props.disabled) && Boolean(props.disabledReason?.trim()))
const disabledTooltip = useButtonTooltip(showsDisabledMessage)

function attrString(name: string): string | undefined {
  const value = attrs[name]
  return typeof value === 'string' ? value : undefined
}

/** 单选别名优先；没给就退回原生属性。 */
const externalDescribedBy = computed(() => props.ariaDescribedBy ?? attrString('aria-describedby'))
const labelledBy = computed(() => props.ariaLabelledBy ?? attrString('aria-labelledby'))
const ariaLabel = computed(() => props.label ?? attrString('aria-label'))

const describedBy = computed(() => {
  return [props.describedBy, externalDescribedBy.value, focusableDisabled.value ? disabledId.value : undefined]
    .filter(Boolean)
    .join(' ') || undefined
})

/**
 * 这些属性由组件自己算，不能让外面透传的值盖掉。
 * 其余的原生属性和事件监听（@keydown / @focus / @blur …）原样落到输入框上。
 */
const controlledAttrs = new Set([
  'id',
  'type',
  'role',
  'value',
  'class',
  'style',
  'disabled',
  'readonly',
  'autofocus',
  'placeholder',
  'tabindex',
  'autocomplete',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-expanded',
  'aria-controls',
  'aria-activedescendant',
  'aria-autocomplete',
  'aria-disabled',
  'aria-required',
])

function inputAttrs(): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)))
}

const menu = useTypeaheadMenu<T>({
  source: () => props.searchSource,
  debounceMs: () => props.debounceMs,
  showOnFocus: () => showsEntriesOnFocus.value,
  minQueryLength: () => props.minQueryLength,
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
    emit('changeQuery', query)
  },
})

/** 下拉挂靠外面给的元素；没给就挂在自己的外框上。 */
const anchor = computed<HTMLElement | null>(() => props.anchorRef ?? controlRef.value ?? null)

const anchored = useAnchoredListbox({
  anchor,
  layer: listboxRef,
  isOpen: menu.combobox.isOpen,
  menuWidth: () => props.menuWidth,
  onDismiss: () => {
    menu.close()
    restoreSelection()
  },
})

/** 由 `Typeahead` 包着时才画边框和选中值标签；单独使用就是裸输入。 */
const hasChrome = inject(typeaheadChromeKey, null) !== null
const selected = computed(() => props.modelValue ?? null)
const showToken = computed(() => hasChrome && selected.value != null && !editing.value)
/** 值的 Token 盖住输入框时，把看不见的输入框从 Tab 序里拿出去。 */
const resolvedTabIndex = computed(() => props.inputTabIndex ?? (showToken.value ? -1 : undefined))

onMounted(() => {
  if (props.hasAutoFocus)
    inputRef.value?.focus()
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
  disabledTooltip.onTooltipPointerEnter()
  if (props.disabled || suppressFocusOpen)
    return
  if (showToken.value) {
    startEdit()
    return
  }
  if (showsEntriesOnFocus.value)
    menu.open()
}

function onBlur(event: FocusEvent): void {
  disabledTooltip.onBlur()
  const next = event.relatedTarget
  if (next instanceof Node && (anchor.value?.contains(next) || listboxRef.value?.contains(next)))
    return
  menu.close()
  restoreSelection()
}

/**
 * 外面的 keydown 先跑，它 preventDefault 就不再走内部导航。
 * 顺序靠模板里 `v-bind` 写在 `@keydown` 前面保证。
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.defaultPrevented)
    return
  menu.onKeyDown(event)
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
  <div class="astryx-typeahead" :class="[`size-${props.size}`, { 'astryx-typeahead--bare': !hasChrome }]">
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是把焦点交给组合框；键盘用户直接 Tab 到输入框。 -->
    <div
      ref="controlRef"
      class="astryx-typeahead-control"
      :class="[`status-${props.status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': props.disabled, 'is-bare': !hasChrome }]"
      @click="onControlClick"
      @pointerenter="disabledTooltip.onPointerEnter"
      @pointerleave="disabledTooltip.onPointerLeave"
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
        v-bind="inputAttrs()"
        :id="inputId"
        ref="inputRef"
        class="astryx-typeahead-input"
        :class="{ 'is-hidden': showToken }"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        :tabindex="resolvedTabIndex"
        :data-autofocus="props.hasAutoFocus || undefined"
        :placeholder="showToken ? undefined : placeholder"
        :value="showToken ? '' : menu.query.value"
        :disabled="props.disabled && !focusableDisabled"
        :readonly="focusableDisabled || undefined"
        :aria-disabled="focusableDisabled ? 'true' : undefined"
        :aria-expanded="menu.combobox.isOpen.value"
        :aria-controls="listboxId"
        :aria-label="ariaLabel"
        :aria-labelledby="labelledBy"
        aria-autocomplete="list"
        :aria-activedescendant="menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined"
        :aria-describedby="describedBy"
        :aria-required="props.required || undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
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
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="disabledTooltipId"
    :anchor="controlRef"
    :open="disabledTooltip.isOpen.value"
    :text="props.disabledReason ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
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
        :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, group: entry.group, selected: optionSelected(entry.item.id) }))"
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
