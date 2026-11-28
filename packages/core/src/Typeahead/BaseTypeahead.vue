<script setup lang="ts" generic="T extends SearchableItem">
import type { StyleValue } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { BaseTypeaheadProps, TypeaheadEmits, TypeaheadSlots } from './types.js'
import { computed, inject, nextTick, onMounted, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useInputStatusIcon } from '../composables/useInputStatusIcon.js'
import { useComponentMessages } from '../locale/context.js'
import { typeaheadMessages } from '../locale/messages/typeahead.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { useLatchedOptionGrid } from '../selectors/useLatchedOptionGrid.js'
import Spinner from '../Spinner/Spinner.vue'
import Token from '../Token/Token.vue'
import { isImeKeyEvent } from '../utils/ime.js'
import { typeaheadChromeKey, typeaheadFocusKey } from './context.js'
import TypeaheadPopup from './TypeaheadPopup.vue'
import { scrollOptionIntoView, useAnchoredListbox } from './useAnchoredListbox.js'
import { useTypeaheadAnnouncement } from './useTypeaheadAnnouncement.js'
import { useTypeaheadMenu } from './useTypeaheadMenu.js'
import { useTypeaheadMenuConfig } from './useTypeaheadMenuConfig.js'
import '../../styles/typeahead.css'
import '../../styles/visually-hidden-utility.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxBaseTypeahead', inheritAttrs: false })

const props = withDefaults(defineProps<BaseTypeaheadProps<T>>(), {
  modelValue: null,
  disabled: false,
  status: 'default',
  size: 'md',
  clearable: true,
  statusVariant: 'attached',
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
const announce = useAnnounce()
const messages = useComponentMessages({ typeahead: typeaheadMessages })
const generatedId = `astryx-typeahead-${useId()}`
const inputId = computed(() => props.inputId ?? generatedId)
const listboxId = computed(() => `${inputId.value}-listbox`)
const disabledId = computed(() => `${inputId.value}-disabled`)
const disabledTooltipId = computed(() => `${inputId.value}-disabled-tooltip`)
const editing = ref(false)
let suppressFocusOpen = false
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const controlRef = useTemplateRef<HTMLElement>('controlRef')
const popupRef = useTemplateRef<{ el: HTMLElement | null }>('popupRef')
const listboxRef = computed(() => popupRef.value?.el ?? null)
useScrollbars(listboxRef)

const placeholder = computed(() => props.placeholder ?? messages.value.typeahead.placeholder)
const emptyText = computed(() => props.emptySearchText ?? props.emptyText ?? messages.value.typeahead.empty)
const clearLabel = computed(() => messages.value.typeahead.clear)
/** 新名 hasEntriesOnFocus 和旧名 showOnFocus 任一为真就生效。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
/** 禁用的字段仍是 Tab 停点：输入框用 aria-disabled 加只读，不用原生 disabled。 */
const focusableDisabled = computed(() => Boolean(props.isFocusableDisabled) || props.disabled)
const disabledDescription = computed(() => focusableDisabled.value && Boolean(props.disabledReason?.trim()))
/** 有禁用原因时鼠标悬停或键盘聚焦都能读到它。 */
const showsDisabledMessage = computed(() => Boolean(props.disabled) && Boolean(props.disabledReason?.trim()))
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const { statusIcon, statusIconProps } = useInputStatusIcon({
  status: () => props.status !== 'default' && props.statusMessage ? { type: props.status, message: props.statusMessage } : undefined,
  statusVariant: () => props.statusVariant,
})

function attrString(name: string): string | undefined {
  const value = attrs[name]
  return typeof value === 'string' ? value : undefined
}

/** 单选别名优先；没给就退回原生属性。 */
const externalDescribedBy = computed(() => props.ariaDescribedBy ?? attrString('aria-describedby'))
const labelledBy = computed(() => props.ariaLabelledBy ?? attrString('aria-labelledby'))
const ariaLabel = computed(() => props.label ?? attrString('aria-label'))

const tokenValueId = computed(() => `${inputId.value}-value`)
/**
 * 有值时，值 Token 的按钮就是这个字段的 Tab 停点。它和输入框一样用字段标签
 * （再加上调用方的 aria-labelledby）命名，后面跟着值；说明也和输入框一样。
 */
const tokenLabelledBy = computed(() => [...new Set([props.labelId, ...(labelledBy.value?.split(' ') ?? []), tokenValueId.value])].filter(Boolean).join(' '))

const describedBy = computed(() => {
  return [props.describedBy, externalDescribedBy.value, disabledDescription.value ? disabledId.value : undefined]
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
  'aria-invalid',
])

function inputAttrs(): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)))
}

/** dialog 角色的菜单只能由 `open()` 打开，输入和聚焦都不开结果列表。 */
const isDialogMenu = computed(() => props.menu?.role === 'dialog')

const menu = useTypeaheadMenu<T>({
  source: () => props.searchSource,
  debounceMs: () => props.debounceMs,
  showOnFocus: () => showsEntriesOnFocus.value,
  minQueryLength: () => props.minQueryLength,
  maxItems: () => props.maxMenuItems,
  disabled: () => props.disabled || isDialogMenu.value,
  onSelect: (entry) => {
    commit(entry.item)
  },
  onQueryChange: (query) => {
    emit('search', query)
    emit('changeQuery', query)
  },
})

/** 搜索忙碌时由输入框念一次「加载中」；框里的转圈图标只是装饰。 */
const settleBusy = useBusyAnnouncement(() => menu.status.value === 'loading', () => messages.value.typeahead.loading, inputRef)

useTypeaheadAnnouncement({
  menu,
  settleBusy,
  emptyText: () => emptyText.value,
  emptySearchText: () => emptyText.value,
  resultCount: count => messages.value.typeahead.resultCount(count),
})

const focusWiring = inject(typeaheadFocusKey, null)
const menuConfig = useTypeaheadMenuConfig({
  config: () => props.menu,
  popupEl: () => listboxRef.value,
  inputEl: () => inputRef.value,
  listbox: { isOpen: menu.combobox.isOpen, open: () => menu.open(), close: () => menu.close() },
  isDisabled: () => props.disabled,
  canOpenList: () => showsEntriesOnFocus.value || menu.query.value !== '',
  returnTarget: () => focusWiring?.inputReturnTarget() ?? null,
})

/** 下拉挂靠外面给的元素；没给就挂在自己的外框上。 */
const anchor = computed<HTMLElement | null>(() => props.anchorRef ?? controlRef.value ?? null)

const anchored = useAnchoredListbox({
  anchor,
  layer: listboxRef,
  isOpen: menuConfig.popupOpen,
  menuWidth: () => props.menuWidth,
  onDismiss: () => {
    if (menuConfig.isDialog.value) {
      menuConfig.dismiss()
      return
    }
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

watch(menuConfig.popupOpen, (isOpen) => {
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
  // 列表是在字段可用时打开的，被禁用之后残留的选项和回车都不能再改值。
  if (props.disabled)
    return
  editing.value = false
  menu.resetQuery()
  // 在 `change` 里调了 `open()` 的话，菜单跟着这次选择保持打开（没有聚焦清单时列表仍收起）。
  menuConfig.beginPick()
  emit('update:modelValue', item)
  emit('change', item)
  if (!menuConfig.endPick() || !showsEntriesOnFocus.value)
    menu.close()
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
  menu.resetQuery()
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

/** 值标签上按退格或删除：有清除按钮就和它一样清掉并念出来，没有就进入编辑。 */
function onTokenKeydown(event: KeyboardEvent): void {
  if ((event.key !== 'Backspace' && event.key !== 'Delete') || props.disabled || selected.value == null)
    return
  event.preventDefault()
  if (props.clearable) {
    const { label } = selected.value
    commit(null)
    announce(messages.value.typeahead.selectionCleared(label))
  }
  else {
    startEdit()
  }
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
const optionGrid = useLatchedOptionGrid({
  entries: () => menu.entries.value,
  isOpen: () => menu.combobox.isOpen.value,
  activeIndex: menu.combobox.activeIndex,
  getListbox: () => listboxRef.value,
  listboxId: () => listboxId.value,
})

function onKeydown(event: KeyboardEvent): void {
  if (event.defaultPrevented || isImeKeyEvent(event))
    return
  if (optionGrid.actionGrid.onKeyDown(event))
    return
  if (menuConfig.isDialog.value) {
    menuConfig.closeOnEscape(event)
    return
  }
  // 编辑已选的值时，Escape 先收起列表；列表已经收起，再按一次才还原标签并把焦点交给它。
  const endsEdit = event.key === 'Escape' && editing.value && !menu.combobox.isOpen.value
  menu.onKeyDown(event)
  if (endsEdit) {
    event.preventDefault()
    restoreSelection()
    void nextTick(() => controlRef.value?.querySelector<HTMLElement>('.astryx-token button')?.focus())
  }
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
  open: menuConfig.open,
  close: menuConfig.close,
})
</script>

<template>
  <div class="astryx-typeahead" :class="[`size-${props.size}`, { 'astryx-typeahead--bare': !hasChrome }]">
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是把焦点交给组合框；键盘用户直接 Tab 到输入框。 -->
    <div
      ref="controlRef"
      class="astryx-typeahead-control"
      :class="[attrs.class, props.controlClass, `status-${props.status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': props.disabled, 'is-bare': !hasChrome }]"
      :style="[attrs.style as StyleValue, props.controlStyle]"
      @click="onControlClick"
      @pointerenter="disabledTooltip.onPointerEnter"
      @pointerleave="disabledTooltip.onPointerLeave"
    >
      <span v-if="$slots.icon" class="astryx-typeahead-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span v-if="showToken && selected" :id="tokenValueId" hidden>{{ selected.label }}</span>
      <Token
        v-if="showToken && selected"
        class="astryx-typeahead-value"
        :label="selected.label"
        :size="props.size"
        :disabled="props.disabled"
        :aria-labelledby="tokenLabelledBy"
        :aria-describedby="describedBy"
        @click="startEdit"
        @keydown="onTokenKeydown"
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
        autocorrect="off"
        enterkeyhint="search"
        :tabindex="resolvedTabIndex"
        :data-autofocus="props.hasAutoFocus || undefined"
        :placeholder="showToken ? undefined : placeholder"
        :value="showToken ? '' : menu.query.value"
        :disabled="props.disabled && !focusableDisabled"
        :readonly="focusableDisabled || undefined"
        :aria-disabled="focusableDisabled ? 'true' : undefined"
        :aria-expanded="menuConfig.popupOpen.value"
        :aria-controls="listboxId"
        :aria-haspopup="menuConfig.isDialog.value ? 'dialog' : optionGrid.popupKind.value"
        :aria-label="ariaLabel"
        :aria-labelledby="labelledBy"
        aria-autocomplete="list"
        :aria-activedescendant="menuConfig.isDialog.value ? undefined : optionGrid.gridMode.value ? optionGrid.actionGrid.activeDescendant.value : (menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined)"
        :aria-describedby="describedBy"
        :aria-required="props.required || undefined"
        :aria-invalid="props.status === 'error' ? true : undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      >
      <Spinner v-if="menu.status.value === 'loading'" class="astryx-typeahead-spinner" size="sm" aria-hidden="true" />
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
      <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
      <span v-if="disabledDescription" :id="disabledId" class="astryx-visually-hidden">{{ props.disabledReason }}</span>
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
  <TypeaheadPopup
    :id="listboxId"
    ref="popupRef"
    :is-open="menuConfig.popupOpen.value"
    :config="props.menu"
    :label="messages.typeahead.results"
    :grid="optionGrid.gridMode.value"
    :placement="anchored.position.value.placement"
    :popup-style="anchored.style.value"
    popup-class="astryx-typeahead-popup"
    :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, group: entry.group, action: entry.action, selected: optionSelected(entry.item.id) }))"
    :active-index="menu.combobox.activeIndex.value"
    :action-index="optionGrid.actionGrid.column.value === 'action' ? menu.combobox.activeIndex.value : -1"
    :status="menu.menuStatus.value"
    :empty-text="emptyText"
    :loading-text="messages.typeahead.loading"
    :error-text="messages.typeahead.error"
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
