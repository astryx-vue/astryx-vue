<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { MultiSelectorCreateChange, MultiSelectorEmits, MultiSelectorHandle, MultiSelectorOptionData, MultiSelectorProps, MultiSelectorSlots } from './types.js'
import { computed, inject, nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useCombobox } from '../composables/useCombobox.js'
import { useDisclosureHandle } from '../composables/useDisclosureHandle.js'
import { useFieldControlState } from '../composables/useFieldControlState.js'
import { useOverflow } from '../composables/useOverflow.js'
import Field from '../Field/Field.vue'
import StatusGlyph from '../Field/StatusGlyph.vue'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { INPUT_GROUP_KEY } from '../InputGroup/context.js'
import { useAstryxMessages } from '../locale/index.js'
import { searchResultMessage } from '../Selector/searchResultMessage.js'
import Spinner from '../Spinner/Spinner.vue'
import Token from '../Token/Token.vue'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { createOptionValue, readCreateQuery, resolveCreateQuery } from './createOption.js'
import { isKeyboardModality, trackInteractionModality } from './interactionModality.js'
import { flattenOptions, SELECT_ALL_VALUE } from './options.js'
import '../../styles/multi-selector.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxMultiSelector', inheritAttrs: false })

const props = withDefaults(defineProps<MultiSelectorProps>(), {
  modelValue: () => [],
  labelHidden: false,
  disabled: false,
  status: 'default',
  statusVariant: 'attached',
  size: 'md',
  variant: 'input',
  presentation: 'popover',
  clearable: false,
  searchable: false,
  selectAll: false,
  triggerDisplay: 'count',
  maxBadges: 3,
  checkboxPosition: 'start',
  required: false,
  optional: false,
  isReadOnly: false,
  isLoading: false,
  hasCreate: false,
})

const emit = defineEmits<MultiSelectorEmits>()

defineSlots<MultiSelectorSlots>()

const CheckboxMark = useIndicator('checkbox')

const messages = useAstryxMessages()
const announce = useAnnounce()
const inputGroup = inject(INPUT_GROUP_KEY, null)
const inGroup = computed(() => inputGroup != null)
const control = useFieldControlState({
  disabled: () => props.disabled || (inputGroup?.disabled.value ?? false),
  readOnly: () => props.isReadOnly,
  loading: () => props.isLoading,
})
const triggerId = `astryx-multi-selector-${useId()}`
const listboxId = `${triggerId}-listbox`
const searchId = `${triggerId}-search`
const disabledId = `${triggerId}-disabled`
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const searchRef = useTemplateRef<HTMLInputElement>('searchRef')
const query = ref('')
const readOnlyId = `${triggerId}-readonly`
const focusableDisabled = computed(() => control.isDisabled.value && Boolean(props.disabledReason?.trim()))
const selectedValues = computed(() => props.modelValue ?? [])
const placeholder = computed(() => props.placeholder ?? messages.value.multiSelector.placeholder)
const searchPlaceholder = computed(() => props.searchPlaceholder ?? messages.value.multiSelector.search)
const selectAllLabel = computed(() => props.selectAllLabel ?? messages.value.multiSelector.selectAll)
const emptyText = computed(() => props.emptyText ?? messages.value.multiSelector.empty)
const emptySearchText = computed(() => props.emptySearchText ?? messages.value.multiSelector.emptySearch)
const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  if (!props.statusMessage || props.status === 'default')
    return undefined
  return { type: props.status, message: props.statusMessage }
})
// 工具栏里的 attached 会收成独立说明；tooltip 把说明留在字段里的图标上。
const effectiveStatusVariant = computed(() => fieldStatusPlacement(props.variant, props.statusVariant))
const statusGlyph = computed(() => {
  if (props.status === 'default' || effectiveStatusVariant.value === 'detached')
    return undefined
  return props.status
})

const rows = computed(() => flattenOptions(props.options, query.value))
const optionByValue = computed(() => {
  const map = new Map<string | number, MultiSelectorOptionData>()
  for (const row of flattenOptions(props.options, '')) {
    if (row.kind === 'option' && row.option)
      map.set(row.option.value, row.option)
  }
  return map
})
const createQuery = computed(() => resolveCreateQuery({
  enabled: props.hasCreate && props.searchable && !control.isLoading.value,
  query: query.value,
  labels: [...optionByValue.value.values()].map(option => option.label),
}))
const createOption = computed<MultiSelectorOptionData | null>(() => {
  if (createQuery.value == null)
    return null
  return {
    value: createOptionValue(createQuery.value),
    label: messages.value.multiSelector.create(createQuery.value),
  }
})
const selectable = computed<MultiSelectorOptionData[]>(() => {
  const items = rows.value.flatMap(row => row.kind === 'option' && row.option ? [row.option] : [])
  const head: MultiSelectorOptionData[] = []
  if (createOption.value)
    head.push(createOption.value)
  if (props.selectAll)
    head.push({ value: SELECT_ALL_VALUE, label: selectAllLabel.value })
  return [...head, ...items]
})
const comboboxOptions = computed(() => selectable.value.map(option => ({
  value: option.value,
  label: option.label,
  disabled: option.disabled ?? false,
  description: option.description,
})))
const dummyValue = ref<string | number | null>(null)
const selectAllIndex = computed(() => props.selectAll ? (createOption.value ? 1 : 0) : -1)

const combobox = useCombobox({
  options: comboboxOptions,
  modelValue: dummyValue,
  isEnabled: control.canActivate,
  isSearchable: ref(false),
  onChange: () => {},
  onOpenChange: (isOpen) => {
    emit('openChange', isOpen)
    if (isOpen && props.searchable) {
      void nextTick(() => searchRef.value?.focus())
    }
    if (!isOpen)
      query.value = ''
  },
})

trackInteractionModality()
const searchKeyboardFocus = ref(false)
const sheetSlot = useTemplateRef<HTMLElement>('sheetSlot')
const isSheet = computed(() => props.presentation === 'bottom-sheet')
const sheetOpen = computed({
  get: () => isSheet.value && combobox.isOpen.value,
  set: (open: boolean) => {
    if (!open && combobox.isOpen.value)
      combobox.close()
  },
})
const listboxTarget = computed(() => isSheet.value && sheetSlot.value ? sheetSlot.value : 'body')

function onSearchFocus(): void {
  searchKeyboardFocus.value = isKeyboardModality()
}

function onSearchBlur(): void {
  searchKeyboardFocus.value = false
}

const anchored = useAnchoredListbox({
  anchor: anchorRef,
  layer: listboxRef,
  isOpen: computed(() => combobox.isOpen.value && !isSheet.value),
  onDismiss: () => {
    combobox.close()
  },
})

const selectedOptions = computed(() => selectedValues.value.flatMap((value) => {
  const option = optionByValue.value.get(value)
  return option ? [option] : []
}))
const enabledValues = computed(() => selectable.value.filter(option => option.value !== SELECT_ALL_VALUE && readCreateQuery(option.value) == null && !option.disabled).map(option => option.value))
const selectedEnabledCount = computed(() => enabledValues.value.filter(value => selectedValues.value.includes(value)).length)
const selectAllState = computed(() => {
  if (selectedEnabledCount.value === 0)
    return 'unchecked' as const
  if (selectedEnabledCount.value === enabledValues.value.length)
    return 'checked' as const
  return 'indeterminate' as const
})
const badgeCount = computed(() => selectedOptions.value.length)
const overflow = useOverflow(badgeCount, { gap: 4 })
const visibleBadgeCount = computed(() => Math.min(overflow.visibleCount.value, props.maxBadges, badgeCount.value))
const hiddenBadgeCount = computed(() => Math.max(0, badgeCount.value - visibleBadgeCount.value))
const measureMoreLabel = computed(() => messages.value.multiSelector.more(Math.max(hiddenBadgeCount.value, 1)))
const labelText = computed(() => {
  const labels = selectedOptions.value.map(option => option.label)
  const shown = labels.slice(0, props.maxBadges)
  const extra = labels.length - shown.length
  if (shown.length === 0)
    return ''
  return extra > 0 ? `${shown.join(', ')} ${messages.value.multiSelector.more(extra)}` : shown.join(', ')
})
const formattedValue = computed(() => {
  if (selectedOptions.value.length === 0 || props.formatValue == null || props.triggerDisplay === 'badges')
    return undefined
  return props.formatValue(selectedOptions.value.map(option => ({ value: option.value, label: option.label })))
})
const realMatchCount = computed(() => rows.value.filter(row => row.kind === 'option').length)
const showEmpty = computed(() => !control.isLoading.value && realMatchCount.value === 0 && createOption.value == null)
const announcement = computed(() => searchResultMessage({
  isOpen: combobox.isOpen.value,
  isLoading: control.isLoading.value,
  query: query.value,
  matchCount: realMatchCount.value,
  hasCreateRow: createOption.value != null,
  emptyText: emptyText.value,
  emptySearchText: emptySearchText.value,
  resultCount: messages.value.multiSelector.resultCount,
}))
const describedBy = computed(() => {
  return [
    inGroup.value ? inputGroup?.describedBy.value : undefined,
    !inGroup.value && props.description ? `${triggerId}-description` : undefined,
    !inGroup.value && props.statusMessage ? `${triggerId}-status` : undefined,
    focusableDisabled.value ? disabledId : undefined,
  ].filter(Boolean).join(' ') || undefined
})

watch(query, (value) => {
  emit('search', value)
  if (combobox.isOpen.value)
    combobox.highlightFirst()
})

watch(announcement, (message) => {
  if (message)
    announce(message)
})

watch(() => [props.hasCreate, props.searchable] as const, ([create, search]) => {
  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true
  if (create && !search && dev)
    console.warn('[MultiSelector] hasCreate 需要同时开启 searchable，否则不会出现创建行。')
}, { immediate: true })

watch(() => combobox.activeIndex.value, (index) => {
  if (!combobox.isOpen.value || index < 0)
    return
  const option = selectable.value[index]
  void nextTick(() => scrollOptionIntoView(listboxRef.value, option ? String(option.value) : undefined))
})

function commit(next: (string | number)[], change?: MultiSelectorCreateChange): void {
  emit('update:modelValue', next)
  emit('change', next, change)
}

function commitCreate(created: string): void {
  const next = [...selectedValues.value, created]
  commit(next, { type: 'create', query: created })
  announce(messages.value.multiSelector.created(created))
  query.value = ''
}

function isSelected(value: string | number): boolean {
  return selectedValues.value.includes(value)
}

function toggleValue(value: string | number): void {
  if (!control.canActivate.value || control.isLoading.value)
    return
  const created = readCreateQuery(value)
  if (created != null) {
    commitCreate(created)
    return
  }
  if (value === SELECT_ALL_VALUE) {
    const allOn = selectAllState.value === 'checked'
    const enabled = new Set(enabledValues.value)
    commit(allOn ? selectedValues.value.filter(item => !enabled.has(item)) : [...new Set([...selectedValues.value, ...enabledValues.value])])
    return
  }
  const option = optionByValue.value.get(value)
  if (option?.disabled)
    return
  commit(isSelected(value) ? selectedValues.value.filter(item => item !== value) : [...selectedValues.value, value])
}

function onTriggerClick(): void {
  if (control.canActivate.value)
    combobox.toggle()
}

function openPanel(): void {
  if (control.canActivate.value)
    combobox.open()
}

function closePanel(): void {
  combobox.close()
}

const handle: MultiSelectorHandle = {
  open: openPanel,
  close: closePanel,
  toggle: () => {
    if (combobox.isOpen.value)
      closePanel()
    else
      openPanel()
  },
  isOpen: () => combobox.isOpen.value,
}
useDisclosureHandle(() => props.handleRef, handle)

function onKeyDown(event: KeyboardEvent): void {
  if (!control.canActivate.value || event.isComposing)
    return
  const searchInput = props.searchable && event.target instanceof HTMLInputElement
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (!combobox.isOpen.value)
        combobox.open()
      else
        combobox.highlightNext()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!combobox.isOpen.value) {
        combobox.open()
        combobox.highlightLast()
      }
      else {
        combobox.highlightPrevious()
      }
      break
    case 'Home':
      if (!searchInput && combobox.isOpen.value) {
        event.preventDefault()
        combobox.highlightFirst()
      }
      break
    case 'End':
      if (!searchInput && combobox.isOpen.value) {
        event.preventDefault()
        combobox.highlightLast()
      }
      break
    case 'PageUp':
      if (combobox.isOpen.value) {
        event.preventDefault()
        combobox.highlightFirst()
      }
      break
    case 'PageDown':
      if (combobox.isOpen.value) {
        event.preventDefault()
        combobox.highlightLast()
      }
      break
    case 'Enter':
    case ' ':
      if (event.key === ' ' && searchInput)
        break
      event.preventDefault()
      if (combobox.isOpen.value && combobox.activeIndex.value >= 0) {
        const option = selectable.value[combobox.activeIndex.value]
        if (option && !option.disabled)
          toggleValue(option.value)
      }
      else if (combobox.isOpen.value && createQuery.value != null) {
        commitCreate(createQuery.value)
      }
      else if (!combobox.isOpen.value) {
        combobox.open()
      }
      break
    case 'Escape':
      if (combobox.isOpen.value) {
        event.preventDefault()
        combobox.close()
        triggerRef.value?.focus()
      }
      break
    case 'Tab':
      if (combobox.isOpen.value)
        combobox.close()
      break
    case 'Backspace':
    case 'Delete':
      if (!searchInput && !combobox.isOpen.value && selectedValues.value.length > 0) {
        event.preventDefault()
        commit([])
      }
      break
    default:
      if (!searchInput && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        if (!combobox.isOpen.value)
          combobox.open()
        combobox.jumpToMatch(event.key)
      }
      break
  }
}

function onSearchInput(event: Event): void {
  query.value = (event.target as HTMLInputElement).value
}

function optionIndex(value: string | number): number {
  return selectable.value.findIndex(option => option.value === value)
}

function optionDomId(index: number): string {
  return `${listboxId}-option-${index}`
}

function highlight(index: number): void {
  const option = selectable.value[index]
  if (option && !option.disabled)
    combobox.activeIndex.value = index
}

function checkboxState(option: MultiSelectorOptionData) {
  if (option.value === SELECT_ALL_VALUE)
    return selectAllState.value
  return isSelected(option.value) ? 'checked' as const : 'unchecked' as const
}

defineExpose({
  focus: () => (props.searchable && combobox.isOpen.value ? searchRef.value : triggerRef.value)?.focus(),
  blur: () => triggerRef.value?.blur(),
  ...handle,
})
</script>

<template>
  <Field
    class="astryx-multi-selector"
    :class="[`size-${props.size}`, `variant-${props.variant}`]"
    :label="props.label"
    :input-id="props.searchable && combobox.isOpen.value ? searchId : triggerId"
    :is-label-hidden="inGroup || props.labelHidden"
    :is-disabled="control.isDisabled.value"
    :is-required="inGroup ? false : props.required"
    :is-optional="inGroup ? false : props.optional"
    :description="inGroup ? undefined : props.description"
    :status="inGroup ? undefined : fieldStatus"
    :status-variant="effectiveStatusVariant"
    :width="props.width"
  >
    <div
      ref="anchorRef"
      class="astryx-multi-selector-control"
      :class="[`status-${props.status}`, {
        'is-open': combobox.isOpen.value,
        'is-disabled': control.isDisabled.value,
        'is-readonly': control.isReadOnly.value,
        'is-loading': control.isLoading.value,
        'is-ghost': props.variant === 'ghost',
      }]"
    >
      <span v-if="$slots.icon" class="astryx-multi-selector-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <button
        :id="triggerId"
        ref="triggerRef"
        type="button"
        class="astryx-multi-selector-trigger"
        :disabled="control.isDisabled.value && !focusableDisabled"
        :aria-disabled="focusableDisabled ? 'true' : undefined"
        :aria-readonly="control.isReadOnly.value || undefined"
        :aria-busy="control.isLoading.value || undefined"
        :role="props.searchable && !control.isReadOnly.value ? undefined : 'combobox'"
        :aria-haspopup="control.isReadOnly.value ? undefined : 'listbox'"
        :aria-expanded="control.isReadOnly.value ? false : combobox.isOpen.value"
        :aria-controls="control.isReadOnly.value ? undefined : listboxId"
        :aria-autocomplete="props.searchable ? undefined : 'none'"
        :aria-activedescendant="!props.searchable && combobox.isOpen.value && combobox.activeIndex.value >= 0 ? optionDomId(combobox.activeIndex.value) : undefined"
        :aria-describedby="[describedBy, control.isReadOnly.value ? readOnlyId : undefined].filter(Boolean).join(' ') || undefined"
        :title="props.disabledReason"
        @click="onTriggerClick"
        @keydown="onKeyDown"
      >
        <span v-if="selectedOptions.length === 0" class="astryx-multi-selector-placeholder">{{ placeholder }}</span>
        <span v-else-if="props.triggerDisplay === 'count'" class="astryx-multi-selector-value">{{ formattedValue ?? messages.multiSelector.selected(selectedOptions.length) }}</span>
        <span v-else-if="props.triggerDisplay === 'labels'" class="astryx-multi-selector-value">{{ formattedValue ?? labelText }}</span>
        <span v-else :ref="overflow.containerRef" class="astryx-multi-selector-badges">
          <Token
            v-for="option in selectedOptions.slice(0, visibleBadgeCount)"
            :key="option.value"
            :label="option.label"
            :size="props.size === 'lg' ? 'md' : 'sm'"
          />
          <span v-if="hiddenBadgeCount > 0" class="astryx-multi-selector-more">
            {{ messages.multiSelector.more(hiddenBadgeCount) }}
          </span>
        </span>
      </button>
      <Spinner v-if="control.isLoading.value" class="astryx-multi-selector-spinner" size="sm" :aria-label="messages.multiSelector.loading" />
      <button
        v-if="props.clearable && selectedValues.length > 0 && control.canActivate.value"
        type="button"
        class="astryx-multi-selector-clear"
        :aria-label="messages.multiSelector.clear"
        @click.stop="commit([])"
      >
        <Icon icon="close" size="sm" />
      </button>
      <StatusGlyph
        v-if="statusGlyph"
        :type="statusGlyph"
        :message="fieldStatus?.message"
        :tooltip="effectiveStatusVariant === 'tooltip'"
      />
      <Icon v-else-if="control.canActivate.value" class="astryx-multi-selector-chevron" :class="{ 'is-open': combobox.isOpen.value }" icon="chevronDown" size="sm" />
      <span v-if="control.isReadOnly.value" :id="readOnlyId" class="astryx-visually-hidden">{{ messages.multiSelector.readOnly }}</span>
      <span v-if="props.triggerDisplay === 'badges'" :ref="overflow.measureRef" class="astryx-multi-selector-measure" aria-hidden="true">
        <Token
          v-for="option in selectedOptions"
          :key="option.value"
          :label="option.label"
          :size="props.size === 'lg' ? 'md' : 'sm'"
        />
        <span class="astryx-multi-selector-more" data-overflow-indicator>{{ measureMoreLabel }}</span>
      </span>
      <span v-if="focusableDisabled" :id="disabledId" class="astryx-visually-hidden">{{ props.disabledReason }}</span>
      <input v-for="value in selectedValues" :key="value" type="hidden" :name="props.name" :value="value" :disabled="!props.name">
    </div>
  </Field>
  <BottomSheet
    v-if="isSheet"
    v-model:is-open="sheetOpen"
    height="hug"
    :label="props.label"
    :padding="2"
  >
    <div ref="sheetSlot" class="astryx-multi-selector-sheet">
      <div class="astryx-multi-selector-sheet-title">
        {{ props.label }}
      </div>
    </div>
  </BottomSheet>
  <Teleport :to="listboxTarget">
    <div
      v-show="combobox.isOpen.value"
      :id="listboxId"
      ref="listboxRef"
      class="astryx-multi-selector-listbox"
      :class="{ 'is-sheet': isSheet }"
      role="listbox"
      aria-multiselectable="true"
      :aria-label="props.label"
      :data-placement="isSheet ? undefined : anchored.position.value.placement"
      :style="isSheet ? undefined : anchored.style.value"
      tabindex="-1"
    >
      <div v-if="props.searchable" class="astryx-multi-selector-search" :data-keyboard-focus="searchKeyboardFocus ? 'true' : undefined">
        <Icon class="astryx-multi-selector-search-icon" icon="search" size="sm" />
        <input
          :id="searchId"
          ref="searchRef"
          class="astryx-multi-selector-search-input"
          type="text"
          role="combobox"
          autocomplete="off"
          :aria-label="searchPlaceholder"
          :aria-expanded="combobox.isOpen.value"
          :aria-controls="listboxId"
          aria-autocomplete="list"
          :aria-activedescendant="combobox.activeIndex.value >= 0 ? optionDomId(combobox.activeIndex.value) : undefined"
          :placeholder="searchPlaceholder"
          :value="query"
          @input="onSearchInput"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
          @keydown="onKeyDown"
        >
        <button
          v-if="query"
          type="button"
          class="astryx-multi-selector-search-clear"
          :aria-label="messages.multiSelector.clear"
          @click.stop="query = ''"
        >
          <Icon icon="close" size="sm" />
        </button>
      </div>
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 创建行不进 Tab 序，方向键和回车由组合框处理。 -->
      <div
        v-if="createOption"
        :id="optionDomId(0)"
        class="astryx-multi-selector-option is-create"
        :class="{ 'is-active': combobox.activeIndex.value === 0 }"
        role="option"
        :aria-selected="false"
        :data-option-id="String(createOption.value)"
        tabindex="-1"
        @mousedown.prevent
        @mouseenter="highlight(0)"
        @click="toggleValue(createOption.value)"
      >
        <span class="astryx-multi-selector-option-label">{{ createOption.label }}</span>
      </div>
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 全选行不进 Tab 序，方向键和空格由组合框处理。 -->
      <div
        v-if="props.selectAll && !control.isLoading.value && realMatchCount > 0"
        :id="optionDomId(selectAllIndex)"
        class="astryx-multi-selector-option is-select-all"
        :class="{ 'is-active': combobox.activeIndex.value === selectAllIndex }"
        role="option"
        :aria-selected="selectAllState === 'checked'"
        :data-option-id="SELECT_ALL_VALUE"
        tabindex="-1"
        @mousedown.prevent
        @mouseenter="highlight(selectAllIndex)"
        @click="toggleValue(SELECT_ALL_VALUE)"
      >
        <component :is="CheckboxMark" v-if="props.checkboxPosition === 'start'" :state="selectAllState" :size="props.size === 'lg' ? 'md' : 'sm'" />
        <span class="astryx-multi-selector-option-label">{{ selectAllLabel }}</span>
        <component :is="CheckboxMark" v-if="props.checkboxPosition === 'end'" :state="selectAllState" :size="props.size === 'lg' ? 'md' : 'sm'" />
      </div>
      <template v-if="!control.isLoading.value">
        <template v-for="row in rows" :key="row.key">
          <div v-if="row.kind === 'divider'" class="astryx-multi-selector-divider" role="separator" />
          <div v-else-if="row.kind === 'heading'" class="astryx-multi-selector-heading" role="presentation">
            {{ row.label }}
          </div>
          <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 选项不进 Tab 序，方向键和空格由组合框处理。 -->
          <div
            v-else-if="row.option"
            :id="optionDomId(optionIndex(row.option.value))"
            class="astryx-multi-selector-option"
            :class="{
              'is-active': optionIndex(row.option.value) === combobox.activeIndex.value,
              'is-disabled': row.option.disabled,
            }"
            role="option"
            :aria-selected="isSelected(row.option.value)"
            :aria-disabled="row.option.disabled || undefined"
            :data-option-id="String(row.option.value)"
            tabindex="-1"
            @mousedown.prevent
            @mouseenter="highlight(optionIndex(row.option.value))"
            @click="toggleValue(row.option.value)"
          >
            <component
              :is="CheckboxMark"
              v-if="props.checkboxPosition === 'start'"
              :state="checkboxState(row.option)"
              :size="props.size === 'lg' ? 'md' : 'sm'"
              :is-disabled="row.option.disabled"
            />
            <span class="astryx-multi-selector-option-copy">
              <slot
                v-if="$slots.option"
                name="option"
                :option="row.option"
                :selected="isSelected(row.option.value)"
                :active="optionIndex(row.option.value) === combobox.activeIndex.value"
              />
              <template v-else>
                <span class="astryx-multi-selector-option-label">{{ row.option.label }}</span>
                <span v-if="row.option.description" class="astryx-multi-selector-option-description">{{ row.option.description }}</span>
              </template>
            </span>
            <component
              :is="CheckboxMark"
              v-if="props.checkboxPosition === 'end'"
              :state="checkboxState(row.option)"
              :size="props.size === 'lg' ? 'md' : 'sm'"
              :is-disabled="row.option.disabled"
            />
          </div>
        </template>
      </template>
      <div v-if="showEmpty" class="astryx-multi-selector-empty" role="presentation">
        <slot v-if="!query.trim()" name="empty">
          {{ emptyText }}
        </slot>
        <template v-else>
          {{ emptySearchText }}
        </template>
      </div>
    </div>
  </Teleport>
</template>
