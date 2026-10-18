<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { SelectorEmits, SelectorEntry, SelectorOption, SelectorProps, SelectorSection, SelectorSlots } from './types.js'
import { computed, inject, nextTick, onMounted, ref, useId, useSlots, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useCombobox } from '../composables/useCombobox.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useFieldControlState } from '../composables/useFieldControlState.js'
import Field from '../Field/Field.vue'
import StatusGlyph from '../Field/StatusGlyph.vue'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { INPUT_GROUP_KEY } from '../InputGroup/context.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useAstryxMessages } from '../locale/index.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { searchResultMessage } from './searchResultMessage.js'
import '../../styles/button.css'
import '../../styles/selector.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxSelector', inheritAttrs: false })

const props = withDefaults(defineProps<SelectorProps>(), {
  modelValue: null,
  disabled: false,
  status: 'default',
  size: 'md',
  searchable: false,
  clearable: false,
  presentation: 'popover',
  variant: 'default',
  statusVariant: 'attached',
  isLabelHidden: false,
  isReadOnly: false,
  isLoading: false,
  isOptional: false,
  isRequired: false,
  indicatorPosition: 'end',
})

const emit = defineEmits<SelectorEmits>()
defineSlots<SelectorSlots>()
const slots = useSlots()
const SelectionMark = useIndicator('check')

const selectorId = `astryx-selector-${useId()}`
const listboxId = `${selectorId}-listbox`
const messages = useAstryxMessages()
const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.selector.placeholder)
const resolvedSearchPlaceholder = computed(() => props.searchPlaceholder ?? messages.value.selector.search)
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clear)
/** 值上的清除按钮带着字段名，读屏能听出清的是哪一项。 */
const valueClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clearField(props.label))
const resolvedEmptyText = computed(() => props.emptyText ?? messages.value.selector.empty)
const resolvedEmptySearchText = computed(() => props.emptySearchText ?? messages.value.selector.emptySearch)
const inputGroup = inject(INPUT_GROUP_KEY, null)
const inGroup = computed(() => inputGroup != null)
const control = useFieldControlState({
  disabled: () => props.disabled || (inputGroup?.disabled.value ?? false),
  readOnly: () => props.isReadOnly,
  loading: () => props.isLoading,
})
const announce = useAnnounce()
const readOnlyId = `${selectorId}-readonly`
const disabledMessageId = `${selectorId}-disabled-message`
const disabledTooltipId = `${selectorId}-disabled-tooltip`
/** 旧名 disabledReason 和新名 disabledMessage 等价。 */
const resolvedDisabledMessage = computed(() => props.disabledMessage?.trim() || props.disabledReason?.trim())
const showsDisabledMessage = computed(() => control.isDisabled.value && !!resolvedDisabledMessage.value)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const hasClear = computed(() => props.hasClear || props.clearable)
const fieldRef = useTemplateRef<HTMLElement>('fieldRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInputRef')
const sheetSlot = useTemplateRef<HTMLElement>('sheetSlot')
const isSheet = computed(() => props.presentation === 'bottom-sheet')
const sheetLabel = computed(() => props.label || resolvedPlaceholder.value)

const isEnabled = control.canActivate
const isSearchable = computed(() => props.searchable && control.canActivate.value)

function isSection(entry: SelectorEntry): entry is SelectorSection {
  return typeof entry === 'object' && entry !== null && 'type' in entry && entry.type === 'section'
}

function asOption(entry: SelectorOption | string): SelectorOption {
  if (typeof entry === 'string')
    return { value: entry, label: entry }
  return entry
}

const normalizedEntries = computed(() => props.options.map((entry) => {
  if (isSection(entry))
    return { ...entry, options: entry.options.map(asOption) }
  return asOption(entry)
}))

const flatOptions = computed(() => normalizedEntries.value.flatMap(entry => isSection(entry) ? entry.options : [entry]))

const comboboxOptions = computed(() =>
  flatOptions.value.map(opt => ({
    value: opt.value,
    label: opt.label,
    disabled: opt.disabled ?? false,
  })),
)

const modelValueRef = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const combobox = useCombobox({
  options: comboboxOptions,
  modelValue: modelValueRef,
  isEnabled,
  isSearchable,
  onChange: (value) => {
    modelValueRef.value = value
  },
  onOpenChange: (isOpen) => {
    if (isOpen && props.searchable) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  },
})

const sheetOpen = computed({
  get: () => isSheet.value && combobox.isOpen.value,
  set: (open: boolean) => {
    if (!open && combobox.isOpen.value)
      combobox.close()
  },
})
const popoverOpen = computed(() => combobox.isOpen.value && !isSheet.value)
const listboxTarget = computed(() => isSheet.value && sheetSlot.value ? sheetSlot.value : 'body')

const { position } = usePositionedLayer({
  anchor: fieldRef,
  layer: listboxRef,
  isOpen: popoverOpen,
  placement: computed(() => 'below'),
  alignment: computed(() => 'start'),
  gap: 4,
})

useDismiss({
  container: listboxRef,
  trigger: fieldRef,
  isEnabled: popoverOpen,
  enableEscape: ref(true),
  onDismiss: () => {
    combobox.close()
  },
})

const selectedOption = computed(() => {
  if (props.modelValue == null)
    return null
  return flatOptions.value.find(opt => opt.value === props.modelValue) ?? null
})

const fieldLabel = computed(() => props.label || resolvedPlaceholder.value)
const hideLabel = computed(() => props.isLabelHidden || !props.label)
const statusType = computed(() => {
  const status = props.status
  if (status == null || status === 'default')
    return 'default'
  if (typeof status === 'string')
    return status
  return status.type
})

const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  const status = props.status
  if (status && typeof status === 'object')
    return status
  if (!props.statusMessage || statusType.value === 'default')
    return undefined
  return { type: statusType.value, message: props.statusMessage }
})

const effectiveStatusVariant = computed(() => fieldStatusPlacement(props.variant, props.statusVariant))
const statusGlyph = computed(() => {
  const type = statusType.value
  if ((type !== 'error' && type !== 'warning' && type !== 'success') || effectiveStatusVariant.value === 'detached')
    return undefined
  return type
})

interface DisplayRow {
  kind: 'section' | 'option'
  title?: string
  option?: SelectorOption
  index?: number
}

const displayRows = computed<DisplayRow[]>(() => {
  const indexByValue = new Map(combobox.filteredOptions.value.map((option, index) => [option.value, index]))
  const rows: DisplayRow[] = []
  for (const entry of normalizedEntries.value) {
    if (isSection(entry)) {
      const children = entry.options.filter(option => indexByValue.has(option.value))
      if (children.length === 0)
        continue
      rows.push({ kind: 'section', title: entry.title })
      for (const option of children)
        rows.push({ kind: 'option', option, index: indexByValue.get(option.value) })
      continue
    }
    if (!indexByValue.has(entry.value))
      continue
    rows.push({ kind: 'option', option: entry, index: indexByValue.get(entry.value) })
  }
  return rows
})

const displayText = computed(() => {
  return selectedOption.value?.label ?? resolvedPlaceholder.value
})

const isEmpty = computed(() => {
  return combobox.filteredOptions.value.length === 0
})
const isSearching = computed(() => props.searchable && combobox.searchQuery.value.trim() !== '')
const showEmpty = computed(() => isEmpty.value && !control.isLoading.value)
const describedBy = computed(() => {
  return [
    inGroup.value ? inputGroup?.describedBy.value : undefined,
    control.isReadOnly.value ? readOnlyId : undefined,
    showsDisabledMessage.value ? disabledMessageId : undefined,
  ].filter(Boolean).join(' ') || undefined
})
const announcement = computed(() => searchResultMessage({
  isOpen: combobox.isOpen.value,
  isLoading: control.isLoading.value,
  query: combobox.searchQuery.value,
  matchCount: combobox.filteredOptions.value.length,
  emptyText: resolvedEmptyText.value,
  emptySearchText: resolvedEmptySearchText.value,
  resultCount: messages.value.selector.resultCount,
}))

watch(announcement, (message) => {
  if (message)
    announce(message)
})

function onTriggerClick(event: MouseEvent): void {
  // 先透出点击再切换面板，preventDefault 不阻断打开。
  emit('click', event)
  if (control.canActivate.value)
    combobox.toggle()
}

function onTriggerFocus(event: FocusEvent): void {
  emit('focus', event)
  disabledTooltip.onFocus(event)
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  combobox.onKeyDown(event)
  // 内置键盘模型处理并取消的按键不再透出。
  if (!event.defaultPrevented)
    emit('keydown', event)
}

/** 搜索框里的按键只走键盘模型，不当作触发器的事件透出。 */
function onSearchKeyDown(event: KeyboardEvent): void {
  combobox.onKeyDown(event)
}

function onOptionClick(option: SelectorOption): void {
  if (!option.disabled) {
    combobox.select(option.value)
  }
}

function onClear(event: Event): void {
  event.stopPropagation()
  if (!control.canActivate.value)
    return
  modelValueRef.value = null
  combobox.close()
}

function clearSearch(event: Event): void {
  event.stopPropagation()
  combobox.setSearchQuery('')
  emit('search', '')
  searchInputRef.value?.focus()
}

function onSearchInput(event: Event): void {
  const target = event.target as HTMLInputElement
  combobox.setSearchQuery(target.value)
  emit('search', target.value)
}

function getOptionId(index: number): string {
  return `${listboxId}-option-${index}`
}

const anchorWidth = ref(0)

function syncAnchorWidth(): void {
  anchorWidth.value = fieldRef.value?.getBoundingClientRect().width ?? 0
}

const listboxStyle = computed(() => isSheet.value
  ? undefined
  : {
      top: `${position.value.top}px`,
      left: `${position.value.left}px`,
      minWidth: anchorWidth.value > 0 ? `${anchorWidth.value}px` : undefined,
    })

watch(combobox.isOpen, (open) => {
  if (open)
    syncAnchorWidth()
}, { flush: 'pre' })

onMounted(syncAnchorWidth)

// 只滚动列表自身，避免把页面滚到尚未定位的浮层上。
watch(() => combobox.activeIndex.value, (index) => {
  if (index >= 0 && combobox.isOpen.value) {
    nextTick(() => {
      const listbox = listboxRef.value
      const optionEl = listbox?.querySelector<HTMLElement>(`#${getOptionId(index)}`)
      if (!listbox || !optionEl)
        return
      const listboxRect = listbox.getBoundingClientRect()
      const optionRect = optionEl.getBoundingClientRect()
      if (optionRect.top < listboxRect.top)
        listbox.scrollTop -= listboxRect.top - optionRect.top
      else if (optionRect.bottom > listboxRect.bottom)
        listbox.scrollTop += optionRect.bottom - listboxRect.bottom
    })
  }
})
</script>

<template>
  <Field
    class="astryx-selector"
    :class="[`size-${props.size}`, `status-${statusType}`, `variant-${props.variant}`]"
    :label="fieldLabel"
    :input-id="selectorId"
    :is-label-hidden="inGroup || hideLabel"
    :is-disabled="control.isDisabled.value"
    :is-optional="inGroup ? false : props.isOptional"
    :is-required="inGroup ? false : props.isRequired"
    :description="inGroup ? undefined : props.description"
    :status="inGroup ? undefined : fieldStatus"
    :status-variant="effectiveStatusVariant"
    :width="props.width"
  >
    <div
      ref="fieldRef"
      class="astryx-selector-field"
      :class="{
        'is-open': combobox.isOpen.value,
        'is-disabled': control.isDisabled.value,
        'is-readonly': control.isReadOnly.value,
        'is-loading': control.isLoading.value,
        'is-ghost': props.variant === 'ghost',
      }"
      @pointerenter="disabledTooltip.onPointerEnter"
      @pointerleave="disabledTooltip.onPointerLeave"
    >
      <button
        :id="selectorId"
        type="button"
        class="astryx-selector-trigger"
        :class="{ 'is-open': combobox.isOpen.value, 'is-disabled': control.isDisabled.value }"
        :disabled="control.isDisabled.value && !showsDisabledMessage"
        :role="control.isReadOnly.value || !props.searchable ? 'combobox' : undefined"
        :aria-haspopup="control.isReadOnly.value ? undefined : 'listbox'"
        :aria-expanded="control.isReadOnly.value ? false : combobox.isOpen.value"
        :aria-controls="control.isReadOnly.value ? undefined : listboxId"
        :aria-readonly="control.isReadOnly.value || undefined"
        :aria-disabled="showsDisabledMessage || undefined"
        :aria-busy="control.isLoading.value || undefined"
        :aria-required="props.isRequired || undefined"
        :aria-label="props.label"
        :aria-describedby="describedBy"
        :aria-autocomplete="props.searchable ? undefined : 'none'"
        :aria-activedescendant="!props.searchable && !control.isReadOnly.value && combobox.activeIndex.value >= 0 ? getOptionId(combobox.activeIndex.value) : undefined"
        @click="onTriggerClick"
        @focus="onTriggerFocus"
        @blur="disabledTooltip.onBlur"
        @keydown="onTriggerKeyDown"
      >
        <span class="astryx-selector-value" :class="{ 'is-placeholder': !selectedOption, 'is-rich': slots.selected, 'is-grouped': inGroup }">
          <slot v-if="slots.selected" name="selected" :option="selectedOption" />
          <template v-else>
            <span v-if="selectedOption?.icon" class="astryx-selector-value-icon" :class="selectedOption.icon" aria-hidden="true" />
            <span class="astryx-selector-value-label">{{ displayText }}</span>
          </template>
        </span>
      </button>
      <Spinner v-if="control.isLoading.value" class="astryx-selector-spinner" size="sm" :aria-label="messages.selector.loading" />
      <button
        v-if="hasClear && selectedOption && control.canActivate.value"
        type="button"
        class="astryx-selector-clear"
        :aria-label="valueClearLabel"
        @click="onClear"
      >
        <Icon icon="close" size="sm" />
      </button>
      <StatusGlyph
        v-if="statusGlyph"
        :type="statusGlyph"
        :message="fieldStatus?.message"
        :tooltip="effectiveStatusVariant === 'tooltip'"
      />
      <Icon v-else-if="control.canActivate.value" class="astryx-selector-icon" icon="chevronDown" size="sm" />
      <span v-if="control.isReadOnly.value" :id="readOnlyId" class="astryx-visually-hidden">{{ messages.selector.readOnly }}</span>
    </div>
    <VisuallyHidden v-if="showsDisabledMessage" :id="disabledMessageId">
      {{ resolvedDisabledMessage }}
    </VisuallyHidden>
    <ButtonTooltip
      v-if="showsDisabledMessage"
      :id="disabledTooltipId"
      :anchor="fieldRef"
      :open="disabledTooltip.isOpen.value"
      :text="resolvedDisabledMessage ?? ''"
      @pointer-enter="disabledTooltip.onTooltipPointerEnter"
      @pointer-leave="disabledTooltip.onTooltipPointerLeave"
    />

    <BottomSheet
      v-if="isSheet"
      v-model:is-open="sheetOpen"
      height="hug"
      :label="sheetLabel"
      :padding="2"
    >
      <div ref="sheetSlot" class="astryx-selector-sheet">
        <div class="astryx-selector-sheet-title">
          {{ sheetLabel }}
        </div>
      </div>
    </BottomSheet>
    <Teleport :to="listboxTarget">
      <div
        v-show="combobox.isOpen.value"
        :id="listboxId"
        ref="listboxRef"
        role="listbox"
        class="astryx-selector-listbox"
        :class="{ 'is-sheet': isSheet }"
        :data-placement="isSheet ? undefined : position.placement"
        :style="listboxStyle"
        tabindex="-1"
      >
        <div v-if="props.searchable" class="astryx-selector-search">
          <Icon class="astryx-selector-search-icon" icon="search" size="sm" />
          <input
            :id="`${selectorId}-search`"
            ref="searchInputRef"
            type="text"
            class="astryx-selector-search-input"
            role="combobox"
            autocomplete="off"
            :aria-label="resolvedSearchPlaceholder"
            :aria-expanded="combobox.isOpen.value"
            :aria-controls="listboxId"
            aria-autocomplete="list"
            :aria-activedescendant="combobox.activeIndex.value >= 0 ? getOptionId(combobox.activeIndex.value) : undefined"
            :placeholder="resolvedSearchPlaceholder"
            :value="combobox.searchQuery.value"
            @input="onSearchInput"
            @keydown="onSearchKeyDown"
          >
          <button
            v-if="combobox.searchQuery.value"
            type="button"
            class="astryx-selector-search-clear"
            :aria-label="resolvedClearLabel"
            @click="clearSearch"
          >
            <Icon icon="close" size="sm" />
          </button>
        </div>

        <div v-if="!control.isLoading.value && !isEmpty" class="astryx-selector-options">
          <template v-for="(row, rowIndex) in displayRows" :key="row.kind === 'section' ? `section-${rowIndex}` : row.option?.value">
            <div v-if="row.kind === 'section'" class="astryx-selector-section" role="presentation">
              {{ row.title }}
            </div>
            <div
              v-else-if="row.option && row.index != null"
              :id="getOptionId(row.index)"
              role="option"
              tabindex="0"
              class="astryx-selector-option"
              :class="{
                'is-active': row.index === combobox.activeIndex.value,
                'is-selected': row.option.value === props.modelValue,
                'is-disabled': row.option.disabled,
              }"
              :aria-selected="row.option.value === props.modelValue"
              :aria-disabled="row.option.disabled"
              @click="onOptionClick(row.option)"
              @keydown.enter="onOptionClick(row.option)"
              @keydown.space.prevent="onOptionClick(row.option)"
            >
              <span v-if="props.indicatorPosition === 'start'" class="astryx-selector-option-mark">
                <component
                  :is="SelectionMark"
                  class="astryx-selector-check"
                  :state="row.option.value === props.modelValue ? 'checked' : 'unchecked'"
                  size="sm"
                  :is-disabled="row.option.disabled"
                />
              </span>
              <span class="astryx-selector-option-body">
                <slot v-if="slots.option" name="option" :option="row.option" :is-active="row.index === combobox.activeIndex.value" :is-selected="row.option.value === props.modelValue" />
                <template v-else>
                  <span v-if="row.option.icon" class="astryx-selector-option-icon" :class="row.option.icon" aria-hidden="true" />
                  <span class="astryx-selector-option-copy">
                    <span class="astryx-selector-option-label">{{ row.option.label }}</span>
                    <span v-if="row.option.description" class="astryx-selector-option-description">
                      {{ row.option.description }}
                    </span>
                  </span>
                </template>
              </span>
              <span v-if="props.indicatorPosition === 'end'" class="astryx-selector-option-mark">
                <component
                  :is="SelectionMark"
                  class="astryx-selector-check"
                  :state="row.option.value === props.modelValue ? 'checked' : 'unchecked'"
                  size="sm"
                  :is-disabled="row.option.disabled"
                />
              </span>
            </div>
          </template>
        </div>

        <div v-else-if="showEmpty" class="astryx-selector-empty" role="presentation">
          <slot v-if="!isSearching && slots.empty" name="empty" />
          <template v-else>
            {{ isSearching ? resolvedEmptySearchText : resolvedEmptyText }}
          </template>
        </div>
      </div>
    </Teleport>

    <select
      v-if="props.name"
      :id="`${selectorId}-hidden-select`"
      :name="props.name"
      :value="props.modelValue ?? ''"
      :disabled="control.isDisabled.value"
      :aria-label="props.label || resolvedPlaceholder"
      tabindex="-1"
      style="position: absolute; left: -9999px; width: 1px; height: 1px;"
    >
      <option value="" />
      <option v-for="option in flatOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </Field>
</template>
