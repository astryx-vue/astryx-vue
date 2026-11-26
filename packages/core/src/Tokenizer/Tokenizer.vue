<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TokenizerChange, TokenizerEmits, TokenizerProps, TokenizerSlots } from './types.js'
import { computed, nextTick, onMounted, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { devPropError, isDevBuild } from '../composables/internal/devBuild.js'
import { useTokenRemoveTap } from '../composables/internal/useTokenRemoveTap.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useComponentMessages } from '../locale/context.js'
import { tokenizerMessages } from '../locale/messages/tokenizer.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { useLatchedOptionGrid } from '../selectors/useLatchedOptionGrid.js'
import { useSize } from '../SizeContext/SizeContext.js'
import Token from '../Token/Token.vue'
import TypeaheadPopup from '../Typeahead/TypeaheadPopup.vue'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadAnnouncement } from '../Typeahead/useTypeaheadAnnouncement.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import { useTypeaheadMenuConfig } from '../Typeahead/useTypeaheadMenuConfig.js'
import { pickInputAttrs } from './inputAttrs.js'
import { useTokenizerDisabled } from './useTokenizerDisabled.js'
import { useTokenizerFieldAria } from './useTokenizerFieldAria.js'
import { useTokenizerKeys } from './useTokenizerKeys.js'
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
  statusVariant: 'attached',
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

if (isDevBuild() && props.modelValue != null && !Array.isArray(props.modelValue)) {
  throw devPropError(
    'Tokenizer',
    'modelValue',
    'must be an array of the selected items, for example v-model="selected" with const selected = ref([]).',
  )
}

// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')

const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'Tokenizer',
  props,
  attrs,
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete', 'aria-disabled', 'aria-required'],
})
const messages = useComponentMessages({ tokenizer: tokenizerMessages })
/** 正名 isLabelHidden，旧名 labelHidden 任一为真就藏起标签。 */
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const inputId = `astryx-tokenizer-${useId()}`
const listboxId = `${inputId}-listbox`
const fieldLabelId = `${inputId}-label`
const disabledId = `${inputId}-disabled`
const disabledTooltipId = `${inputId}-disabled-tooltip`
const values = computed(() => props.modelValue ?? [])
const focused = ref(false)
const placeholderHeight = ref(0)
const announce = useAnnounce()
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const popupRef = useTemplateRef<{ el: HTMLElement | null }>('popupRef')
const listboxRef = computed(() => popupRef.value?.el ?? null)
useScrollbars(listboxRef)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const tokenEls = new Map<number, HTMLElement>()

const placeholder = computed(() => props.placeholder ?? messages.value.tokenizer.placeholder)
const emptyText = computed(() => props.emptySearchText ?? props.emptyText ?? messages.value.tokenizer.empty)
const { disabledMessage, showsDisabledMessage, focusableDisabled, disabledTooltip } = useTokenizerDisabled(props)
/** 两个名字任一为真就画清除按钮。 */
const showsClear = computed(() => props.hasClear || props.clearable)
/** 两个名字任一为真就在聚焦时先展开。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
/** 两个名字任一为真就能从输入的文字新建标签。 */
const isCreatable = computed(() => props.hasCreate || props.creatable)
/** 禁用的字段不向表单交值：不渲染隐藏输入，而不是渲染一个原生禁用的。 */
const hiddenCarrierItems = computed(() => props.disabled ? [] : values.value)
const atMax = computed(() => props.maxEntries != null && values.value.length >= props.maxEntries)
const collapsed = computed(() => props.overflow !== 'none' && !focused.value)
const floating = computed(() => props.overflow === 'unfocused-layer' && focused.value)
const { fieldStatus, labelledBy, statusIcon, statusIconProps, describedBy } = useTokenizerFieldAria({
  props,
  attrs,
  inputId,
  fieldLabelId,
  disabledId,
  hasDisabledDescription: computed(() => focusableDisabled.value && Boolean(disabledMessage.value)),
})

function inputAttrs(): Record<string, unknown> {
  return pickInputAttrs(attrs)
}

const menu = useTypeaheadMenu<T>({
  source: () => props.searchSource,
  debounceMs: () => props.debounceMs,
  showOnFocus: () => showsEntriesOnFocus.value && !atMax.value,
  minQueryLength: () => props.minQueryLength,
  maxItems: () => props.maxMenuItems,
  disabled: () => props.disabled || atMax.value || props.menu?.role === 'dialog',
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

/** 搜索忙碌时由输入框念一次「加载中」；列表里的转圈只是装饰。 */
const settleBusy = useBusyAnnouncement(() => menu.status.value === 'loading', () => messages.value.tokenizer.loading, inputRef)

useTypeaheadAnnouncement({
  menu,
  settleBusy,
  emptyText: () => emptyText.value,
  emptySearchText: () => emptyText.value,
  resultCount: count => messages.value.tokenizer.resultCount(count),
})

const menuConfig = useTypeaheadMenuConfig({
  config: () => props.menu,
  popupEl: () => listboxRef.value,
  inputEl: () => inputRef.value,
  listbox: { isOpen: menu.combobox.isOpen, open: () => menu.open(), close: () => menu.close() },
  isDisabled: () => props.disabled,
  canOpenList: () => showsEntriesOnFocus.value || menu.query.value !== '',
})

const anchored = useAnchoredListbox({
  anchor: anchorRef,
  layer: listboxRef,
  isOpen: menuConfig.popupOpen,
  menuWidth: () => props.menuWidth,
  onDismiss: () => menuConfig.isDialog.value ? menuConfig.dismiss() : menu.close(),
})

onMounted(() => {
  if (props.hasAutoFocus)
    inputRef.value?.focus()
})

const removeTap = useTokenRemoveTap({ root: anchorRef, input: inputRef, tokenSelector: '.astryx-tokenizer-token' })
const tokenCount = computed(() => values.value.length)
const overflow = useOverflow(tokenCount, { gap: 4 })
const visibleCount = computed(() => collapsed.value ? overflow.visibleCount.value : tokenCount.value)
const hiddenCount = computed(() => Math.max(0, tokenCount.value - visibleCount.value))
const measureMoreLabel = computed(() => messages.value.tokenizer.more(Math.max(hiddenCount.value, 1)))
const visibleItems = computed(() => values.value.slice(0, visibleCount.value))

watch(collapsed, () => void nextTick(() => overflow.remeasure()))
watch(menuConfig.popupOpen, isOpen => emit('openChange', isOpen))

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
  // 从聚焦时展开的那张清单里选（还没输入过文字）：焦点和清单都留着，方便接着选下一个。
  const fromFocusList = showsEntriesOnFocus.value && type === 'add' && menu.query.value === ''
  const pickedIndex = Math.max(0, menu.entries.value.findIndex(entry => entry.item.id === item.id))
  menuConfig.beginPick()
  commit([...values.value, item], { type, item })
  announce(messages.value.tokenizer.added(item.label))
  menu.resetQuery()
  // 在 `change` 里调了 `open()` 的话，菜单跟着这次选择保持打开。
  if (!fromFocusList && !menuConfig.endPick())
    menu.close()
  void nextTick(() => {
    inputRef.value?.focus()
    if (!fromFocusList)
      return
    // 清单留着原来的行，只去掉刚选的：下一项变成高亮，选的是最后一项就落到前一项；
    // 没有可选项了、到了上限或字段被禁用就收起。
    const remaining = menu.entries.value
    if (remaining.length === 0 || atMax.value || props.disabled)
      menu.close()
    else
      menu.combobox.activeIndex.value = Math.min(pickedIndex, remaining.length - 1)
  })
}

function remove(item: T): void {
  if (props.disabled)
    return
  const next = values.value.filter(entry => entry.id !== item.id)
  commit(next, { type: 'remove', item })
  announce(messages.value.tokenizer.removed(item.label))
  if (removeTap.shouldFocusInputAfterRemove())
    void nextTick(() => inputRef.value?.focus())
}

function clearAll(event?: Event): void {
  event?.stopPropagation()
  if (props.disabled || values.value.length === 0)
    return
  commit([], { type: 'clear' })
  announce(messages.value.tokenizer.allRemoved)
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
  if (event.target === inputRef.value && showsEntriesOnFocus.value && !props.disabled && !atMax.value)
    menu.open()
  if (comingFromOutside)
    emit('focus', event)
}

function onFocusOut(event: FocusEvent): void {
  disabledTooltip.onBlur()
  if (isInsideTokenizer(event.relatedTarget))
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

const optionGrid = useLatchedOptionGrid({
  entries: () => menu.entries.value,
  isOpen: () => menu.combobox.isOpen.value,
  activeIndex: menu.combobox.activeIndex,
  getListbox: () => listboxRef.value,
  listboxId: () => listboxId,
})

const { onInputKeyDown: onListKeyDown, onTokenKeyDown } = useTokenizerKeys<T>({
  values,
  disabled: () => props.disabled,
  menu,
  optionGrid,
  inputRef,
  remove,
  focusToken,
})

function onInputKeyDown(event: KeyboardEvent): void {
  if (!menuConfig.closeOnEscape(event))
    onListKeyDown(event)
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
  open: menuConfig.open,
  close: menuConfig.close,
})
</script>

<template>
  <Field
    class="astryx-tokenizer"
    :class="[parts.containerClass.value, `size-${size}`, { 'is-floating': floating }]"
    :style="parts.containerStyle.value"
    :label="props.label"
    :input-id="inputId"
    :description="props.description"
    :label-tooltip="props.labelTooltip"
    :is-label-hidden="hideLabel"
    :is-disabled="props.disabled"
    :is-required="props.required"
    :is-optional="props.optional"
    :status="fieldStatus"
    :status-variant="props.statusVariant"
    :width="props.width"
  >
    <div v-if="floating" class="astryx-tokenizer-placeholder" :style="{ height: `${placeholderHeight}px` }" />
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是把焦点交给输入框；方向键和删除由输入框与标签处理。 -->
    <div
      ref="anchorRef"
      class="astryx-tokenizer-control"
      :class="[parts.controlClass(), `status-${props.status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': props.disabled, 'is-floating': floating, 'has-tokens': values.length > 0 }]"
      :style="parts.controlStyle()"
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
            <Token :label="item.label" :size="size" :disabled="props.disabled" removable @remove="remove(item)" />
          </slot>
        </span>
        <span v-if="collapsed && hiddenCount > 0" class="astryx-tokenizer-more">
          {{ messages.tokenizer.more(hiddenCount) }}
        </span>
      </span>
      <span :ref="overflow.measureRef" class="astryx-tokenizer-measure" aria-hidden="true">
        <span v-for="item in values" :key="item.id" class="astryx-tokenizer-token">
          <Token :label="item.label" :size="size" removable />
        </span>
        <span class="astryx-tokenizer-more" data-overflow-indicator>{{ measureMoreLabel }}</span>
      </span>
      <input
        v-bind="inputAttrs()"
        :id="inputId"
        ref="inputRef"
        class="astryx-tokenizer-input"
        :class="{ 'is-empty': menu.query.value === '' }"
        type="text"
        role="combobox"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        enterkeyhint="search"
        :data-autofocus="props.hasAutoFocus || undefined"
        :placeholder="values.length === 0 ? placeholder : undefined"
        :value="menu.query.value"
        :disabled="props.disabled && !focusableDisabled"
        :readonly="focusableDisabled || atMax || undefined"
        :aria-disabled="focusableDisabled ? 'true' : undefined"
        :aria-expanded="menuConfig.popupOpen.value"
        :aria-haspopup="menuConfig.isDialog.value ? 'dialog' : optionGrid.popupKind.value"
        :aria-controls="listboxId"
        aria-autocomplete="list"
        :aria-activedescendant="menuConfig.isDialog.value ? undefined : optionGrid.gridMode.value ? optionGrid.actionGrid.activeDescendant.value : (menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined)"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        :aria-required="props.required || undefined"
        :aria-invalid="props.status === 'error' ? true : undefined"
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
      <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
      <span v-if="focusableDisabled && disabledMessage" :id="disabledId" class="astryx-visually-hidden">{{ disabledMessage }}</span>
      <input v-for="item in hiddenCarrierItems" :key="`${props.name}-${item.id}`" type="hidden" :name="props.name" :value="item.id" :disabled="!props.name">
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
  <TypeaheadPopup
    :id="listboxId"
    ref="popupRef"
    :is-open="menuConfig.popupOpen.value"
    :config="props.menu"
    :label="messages.tokenizer.results"
    :grid="optionGrid.gridMode.value"
    :placement="anchored.position.value.placement"
    :popup-style="anchored.style.value"
    :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, group: entry.group, action: entry.action, selected: values.some(item => item.id === entry.item.id) }))"
    :active-index="menu.combobox.activeIndex.value"
    :action-index="optionGrid.actionGrid.column.value === 'action' ? menu.combobox.activeIndex.value : -1"
    :status="menu.menuStatus.value"
    :empty-text="emptyText"
    :loading-text="messages.tokenizer.loading"
    :error-text="messages.tokenizer.error"
    :query="menu.query.value"
    :is-settled="menu.isSettled.value"
    @select="onMenuSelect"
    @highlight="highlight"
    @close="menuConfig.close"
    @keydown="menuConfig.closeOnEscape"
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
    <template v-if="$slots.menu" #menu="menuProps">
      <slot name="menu" v-bind="menuProps" />
    </template>
  </TypeaheadPopup>
</template>
