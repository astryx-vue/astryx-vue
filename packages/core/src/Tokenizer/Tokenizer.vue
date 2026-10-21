<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { TokenizerChange, TokenizerEmits, TokenizerProps, TokenizerSlots } from './types.js'
import { computed, nextTick, onMounted, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import Token from '../Token/Token.vue'
import TypeaheadMenu from '../Typeahead/TypeaheadMenu.vue'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import '../../styles/typeahead.css'
import '../../styles/tokenizer.css'
import '../../styles/visually-hidden-utility.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxTokenizer', inheritAttrs: false })

const props = withDefaults(defineProps<TokenizerProps<T>>(), {
  modelValue: () => [],
  labelHidden: false,
  disabled: false,
  status: 'default',
  size: 'md',
  clearable: false,
  hasClear: false,
  debounceMs: 150,
  maxMenuItems: 10,
  minQueryLength: 1,
  showOnFocus: false,
  hasAutoFocus: false,
  creatable: false,
  hasCreate: false,
  overflow: 'none',
  required: false,
  optional: false,
})

const emit = defineEmits<TokenizerEmits<T>>()
defineSlots<TokenizerSlots<T>>()

const attrs = useAttrs()
const messages = useAstryxMessages()
/** 正名 isLabelHidden，旧名 labelHidden 任一为真就藏起标签。 */
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const inputId = `astryx-tokenizer-${useId()}`
const listboxId = `${inputId}-listbox`
const disabledId = `${inputId}-disabled`
const disabledTooltipId = `${inputId}-disabled-tooltip`
const values = computed(() => props.modelValue ?? [])
const focused = ref(false)
const placeholderHeight = ref(0)
const announce = useAnnounce()
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
useScrollbars(listboxRef)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const tokenEls = new Map<number, HTMLElement>()

const placeholder = computed(() => props.placeholder ?? messages.value.tokenizer.placeholder)
const emptyText = computed(() => props.emptySearchText ?? props.emptyText ?? messages.value.tokenizer.empty)
/** 新名 disabledMessage 优先，旧名 disabledReason 继续可用。 */
const disabledMessage = computed(() => {
  const message = props.disabledMessage?.trim() ? props.disabledMessage : props.disabledReason
  return message?.trim() ? message : undefined
})
const focusableDisabled = computed(() => Boolean(props.disabled && disabledMessage.value))
/** 有禁用原因时鼠标悬停或键盘聚焦都能读到它。 */
const showsDisabledMessage = computed(() => Boolean(props.disabled) && Boolean(disabledMessage.value))
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
/** 两个名字任一为真就画清除按钮。 */
const showsClear = computed(() => props.hasClear || props.clearable)
/** 两个名字任一为真就在聚焦时先展开。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
/** 两个名字任一为真就能从输入的文字新建标签。 */
const isCreatable = computed(() => props.hasCreate || props.creatable)
const atMax = computed(() => props.maxEntries != null && values.value.length >= props.maxEntries)
const collapsed = computed(() => props.overflow !== 'none' && !focused.value)
const floating = computed(() => props.overflow === 'unfocused-layer' && focused.value)
const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  if (!props.statusMessage || props.status === 'default')
    return undefined
  return { type: props.status, message: props.statusMessage }
})
const describedBy = computed(() => {
  // 外面给的 aria-describedby 和自己算出来的说明都要读，不能二选一。
  const external = typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined
  return [external, props.description ? `${inputId}-description` : undefined, props.statusMessage ? `${inputId}-status` : undefined, focusableDisabled.value ? disabledId : undefined].filter(Boolean).join(' ') || undefined
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
  showOnFocus: () => showsEntriesOnFocus.value && !atMax.value,
  minQueryLength: () => props.minQueryLength,
  maxItems: () => props.maxMenuItems,
  disabled: () => props.disabled || atMax.value,
  excludeIds: () => values.value.map(item => item.id),
  blockedLabels: () => values.value.map(item => item.label),
  creatable: () => isCreatable.value && !atMax.value,
  createLabel: query => messages.value.tokenizer.create(query),
  onSelect: entry => add(entry.item, entry.create ? 'create' : 'add'),
  onQueryChange: (query) => {
    emit('search', query)
    emit('changeQuery', query)
  },
})

const anchored = useAnchoredListbox({
  anchor: anchorRef,
  layer: listboxRef,
  isOpen: menu.combobox.isOpen,
  menuWidth: () => props.menuWidth,
  onDismiss: () => menu.close(),
})

onMounted(() => {
  if (props.hasAutoFocus)
    inputRef.value?.focus()
})

const tokenCount = computed(() => values.value.length)
const overflow = useOverflow(tokenCount, { gap: 4 })
const visibleCount = computed(() => collapsed.value ? overflow.visibleCount.value : tokenCount.value)
const hiddenCount = computed(() => Math.max(0, tokenCount.value - visibleCount.value))
const measureMoreLabel = computed(() => messages.value.tokenizer.more(Math.max(hiddenCount.value, 1)))
const visibleItems = computed(() => values.value.slice(0, visibleCount.value))

watch(collapsed, () => {
  void nextTick(() => overflow.remeasure())
})

watch(() => menu.combobox.isOpen.value, (isOpen) => {
  emit('openChange', isOpen)
})

watch(() => menu.combobox.activeIndex.value, (index) => {
  if (!menu.combobox.isOpen.value || index < 0)
    return
  void nextTick(() => scrollOptionIntoView(listboxRef.value, menu.entries.value[index]?.id))
})

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

/** 焦点从外面进来（而不是在字段内部换元素）才算。 */
function onFocusIn(event: FocusEvent): void {
  const comingFromOutside = !isInsideTokenizer(event.relatedTarget)
  disabledTooltip.onTooltipPointerEnter()
  if (!focused.value && props.overflow === 'unfocused-layer')
    placeholderHeight.value = anchorRef.value?.offsetHeight ?? 0
  focused.value = true
  if (comingFromOutside)
    emit('focus', event)
}

function onFocusOut(event: FocusEvent): void {
  disabledTooltip.onBlur()
  const next = event.relatedTarget
  if (next instanceof Node && (anchorRef.value?.contains(next) || listboxRef.value?.contains(next)))
    return
  focused.value = false
  menu.close()
  emit('blur', event)
}

function isInsideTokenizer(node: EventTarget | null): boolean {
  if (!(node instanceof Node))
    return false
  return Boolean(anchorRef.value?.contains(node) || listboxRef.value?.contains(node))
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (event.defaultPrevented)
    return
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
    :label-tooltip="props.labelTooltip"
    :is-label-hidden="hideLabel"
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
      @pointerenter="disabledTooltip.onPointerEnter"
      @pointerleave="disabledTooltip.onPointerLeave"
    >
      <span v-if="$slots.icon" class="astryx-tokenizer-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span
        :ref="overflow.containerRef"
        class="astryx-tokenizer-tokens"
        :class="{ 'is-collapsed': collapsed }"
      >
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键在标签容器上移动焦点，删除由内部按钮处理。 -->
        <span
          v-for="(item, index) in visibleItems"
          :key="item.id"
          :ref="element => setTokenEl(index, element)"
          class="astryx-tokenizer-token"
          tabindex="-1"
          @keydown="onTokenKeyDown($event, item, index)"
        >
          <slot name="token" :item="item" :remove="() => remove(item)">
            <Token :label="item.label" :size="props.size" :disabled="props.disabled" removable @remove="remove(item)" />
          </slot>
        </span>
        <span v-if="collapsed && hiddenCount > 0" class="astryx-tokenizer-more">
          {{ messages.tokenizer.more(hiddenCount) }}
        </span>
      </span>
      <span :ref="overflow.measureRef" class="astryx-tokenizer-measure" aria-hidden="true">
        <span v-for="item in values" :key="item.id" class="astryx-tokenizer-token">
          <Token :label="item.label" :size="props.size" removable />
        </span>
        <span class="astryx-tokenizer-more" data-overflow-indicator>{{ measureMoreLabel }}</span>
      </span>
      <input
        v-bind="inputAttrs()"
        :id="inputId"
        ref="inputRef"
        class="astryx-tokenizer-input"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        :data-autofocus="props.hasAutoFocus || undefined"
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
        @input="onInput"
        @keydown="onInputKeyDown"
      >
      <slot name="end" />
      <button
        v-if="showsClear && values.length > 0 && !props.disabled"
        type="button"
        class="astryx-tokenizer-clear"
        :aria-label="messages.tokenizer.clear"
        @click="clearAll"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <span v-if="focusableDisabled" :id="disabledId" class="astryx-visually-hidden">{{ disabledMessage }}</span>
      <input v-for="item in values" :key="`${props.name}-${item.id}`" type="hidden" :name="props.name" :value="item.id" :disabled="!props.name">
    </div>
  </Field>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="disabledTooltipId"
    :anchor="anchorRef"
    :open="disabledTooltip.isOpen.value"
    :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
  <Teleport to="body">
    <div
      v-show="menu.combobox.isOpen.value"
      :id="listboxId"
      ref="listboxRef"
      class="astryx-typeahead-listbox astryx-layer"
      role="listbox"
      :aria-label="messages.tokenizer.results"
      :data-placement="anchored.position.value.placement"
      :style="anchored.style.value"
      tabindex="-1"
    >
      <TypeaheadMenu
        :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, group: entry.group, selected: values.some(item => item.id === entry.item.id) }))"
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
