<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { SelectorEmits, SelectorOption, SelectorProps, SelectorSlots } from './types.js'
import { computed, nextTick, onMounted, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useCombobox } from '../composables/useCombobox.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useFieldControlState } from '../composables/useFieldControlState.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import StatusGlyph from '../Field/StatusGlyph.vue'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { useInputGroupContext } from '../InputGroup/context.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { normalizeTriggerVariant } from '../selectors/triggerVariant.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { searchResultMessage } from './searchResultMessage.js'
import { bindListboxEscape, dismissSelectorEscape, focusSelectorTrigger, onSelectorListboxEscape } from './selectorEscape.js'
import { buildSelectorRows, flattenSelectorOptions, normalizeSelectorEntries } from './selectorOptions.js'
import SelectorPanel from './SelectorPanel.vue'
import { useSelectorPopup } from './useSelectorPopup.js'
import '../../styles/button.css'
import '../../styles/layer.css'
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
const attrs = useAttrs()
const SelectionMark = useIndicator('check')
const parts = useFieldPartStyling({
  component: 'Selector',
  props,
  attrs,
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete', 'aria-disabled', 'aria-required', 'aria-busy', 'aria-readonly'],
})
const triggerVariant = computed(() => normalizeTriggerVariant(props.variant))

const generatedId = `astryx-selector-${useId()}`
const selectorId = computed(() => typeof attrs.id === 'string' && attrs.id !== '' ? attrs.id : generatedId)
const listboxId = computed(() => `${selectorId.value}-listbox`)
const messages = useAstryxMessages()
const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.selector.placeholder)
const resolvedSearchPlaceholder = computed(() => props.searchPlaceholder ?? messages.value.selector.search)
const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clear)
/** 值上的清除按钮带着字段名，读屏能听出清的是哪一项。 */
const valueClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clearField(props.label))
const resolvedEmptyText = computed(() => props.emptyText ?? messages.value.selector.empty)
const resolvedEmptySearchText = computed(() => props.emptySearchText ?? messages.value.selector.emptySearch)
const inputGroup = useInputGroupContext()
const inGroup = computed(() => inputGroup != null)
const control = useFieldControlState({
  disabled: () => props.disabled || (inputGroup?.disabled.value ?? false),
  readOnly: () => props.isReadOnly,
  loading: () => props.isLoading,
})
const announce = useAnnounce()
const readOnlyId = computed(() => `${selectorId.value}-readonly`)
const disabledMessageId = computed(() => `${selectorId.value}-disabled-message`)
const disabledTooltipId = computed(() => `${selectorId.value}-disabled-tooltip`)
/** 旧名 disabledReason 和新名 disabledMessage 等价。 */
const resolvedDisabledMessage = computed(() => props.disabledMessage?.trim() || props.disabledReason?.trim())
const showsDisabledMessage = computed(() => control.isDisabled.value && !!resolvedDisabledMessage.value)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const hasClear = computed(() => props.hasClear || props.clearable)
const fieldRef = useTemplateRef<HTMLElement>('fieldRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
const panelRef = useTemplateRef<{ focusSearch: () => void }>('panelRef')
const sheetSlot = useTemplateRef<HTMLElement>('sheetSlot')
useScrollbars(listboxRef)
const isSheet = computed(() => props.presentation === 'bottom-sheet')
const sheetLabel = computed(() => props.label || resolvedPlaceholder.value)

const isEnabled = control.canActivate
const isSearchable = computed(() => props.searchable && control.canActivate.value)

const normalizedEntries = computed(() => normalizeSelectorEntries(props.options))
const flatOptions = computed(() => flattenSelectorOptions(normalizedEntries.value))

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
        panelRef.value?.focusSearch()
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

const { position, teleportTarget } = usePositionedLayer({
  anchor: fieldRef,
  layer: listboxRef,
  isOpen: popoverOpen,
  placement: computed(() => 'below'),
  alignment: computed(() => 'start'),
  gap: 4,
})

function focusTrigger(): void {
  focusSelectorTrigger(fieldRef.value)
}

bindListboxEscape(listboxRef, (event) => {
  onSelectorListboxEscape(event, {
    isOpen: combobox.isOpen.value,
    layer: listboxRef.value,
    close: () => combobox.close(),
    focusTrigger,
  })
})

useDismiss({
  container: listboxRef,
  trigger: fieldRef,
  isEnabled: popoverOpen,
  dismissOnEscape: 'close',
  onEscape: () => dismissSelectorEscape(listboxRef.value, () => combobox.close(), focusTrigger),
  onDismiss: () => combobox.close(),
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

const displayRows = computed(() => buildSelectorRows(normalizedEntries.value, combobox.filteredOptions.value))

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
    control.isReadOnly.value ? readOnlyId.value : undefined,
    showsDisabledMessage.value ? disabledMessageId.value : undefined,
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

const popup = useSelectorPopup({
  flatOptions,
  filteredValues: computed(() => combobox.filteredOptions.value),
  listboxId,
  listboxRef,
  isOpen: combobox.isOpen,
  activeIndex: combobox.activeIndex,
  onListKeyDown: (event) => {
    const wasOpen = combobox.isOpen.value
    combobox.onKeyDown(event)
    if (event.key === 'Escape' && wasOpen)
      focusTrigger()
  },
  isReadOnly: () => control.isReadOnly.value,
  isSheet: () => isSheet.value,
  emitKeydown: event => emit('keydown', event),
})
const { gridMode, actionGrid, popupKind } = popup

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

function onPanelQuery(value: string): void {
  combobox.setSearchQuery(value)
  emit('search', value)
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
</script>

<template>
  <Field
    class="astryx-selector"
    :class="[parts.containerClass.value, `size-${props.size}`, `status-${statusType}`, `variant-${triggerVariant}`]"
    :style="parts.containerStyle.value"
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
      :class="[parts.controlClass(), {
        'is-open': combobox.isOpen.value,
        'is-disabled': control.isDisabled.value,
        'is-readonly': control.isReadOnly.value,
        'is-loading': control.isLoading.value,
        'is-ghost': triggerVariant === 'ghost',
      }]"
      :style="parts.controlStyle()"
      :data-variant="triggerVariant"
      @pointerenter="disabledTooltip.onPointerEnter"
      @pointerleave="disabledTooltip.onPointerLeave"
    >
      <button
        v-bind="parts.forwardedAttrs()"
        :id="selectorId"
        type="button"
        class="astryx-selector-trigger"
        :class="{ 'is-open': combobox.isOpen.value, 'is-disabled': control.isDisabled.value }"
        :disabled="control.isDisabled.value && !showsDisabledMessage"
        :role="control.isReadOnly.value || !props.searchable ? 'combobox' : undefined"
        :aria-haspopup="popupKind"
        :aria-expanded="control.isReadOnly.value ? false : combobox.isOpen.value"
        :aria-controls="control.isReadOnly.value ? undefined : listboxId"
        :aria-readonly="control.isReadOnly.value || undefined"
        :aria-disabled="showsDisabledMessage || undefined"
        :aria-busy="control.isLoading.value || undefined"
        :aria-required="props.isRequired || undefined"
        :aria-label="props.label"
        :aria-describedby="describedBy"
        :aria-autocomplete="props.searchable ? undefined : 'none'"
        :aria-activedescendant="!props.searchable && !control.isReadOnly.value ? actionGrid.activeDescendant.value : undefined"
        @click="onTriggerClick"
        @focus="onTriggerFocus"
        @blur="disabledTooltip.onBlur"
        @keydown="popup.onTriggerKeyDown"
      >
        <span class="astryx-selector-value" :class="{ 'is-placeholder': !selectedOption, 'is-rich': slots.selected, 'is-grouped': inGroup }">
          <slot v-if="slots.selected" name="selected" :option="selectedOption" />
          <template v-else>
            <Icon v-if="selectedOption?.icon" class="astryx-selector-value-icon" :icon="selectedOption.icon" size="sm" />
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
    <Teleport :to="(isSheet && sheetSlot) ? sheetSlot : teleportTarget">
      <div
        v-show="combobox.isOpen.value"
        :id="listboxId"
        ref="listboxRef"
        :role="gridMode ? 'grid' : 'listbox'"
        class="astryx-selector-listbox astryx-layer"
        :class="{ 'is-sheet': isSheet }"
        :data-placement="isSheet ? undefined : position.placement"
        :style="listboxStyle"
        tabindex="-1"
      >
        <SelectorPanel
          ref="panelRef"
          :searchable="props.searchable"
          :query="combobox.searchQuery.value"
          :placeholder="resolvedSearchPlaceholder"
          :clear-label="resolvedClearLabel"
          :rows="displayRows"
          :active-index="combobox.activeIndex.value"
          :model-value="props.modelValue"
          :indicator-position="props.indicatorPosition"
          :grid="gridMode"
          :action-index="actionGrid.column.value === 'action' ? combobox.activeIndex.value : -1"
          :loading="control.isLoading.value"
          :show-empty="showEmpty"
          :searching="isSearching"
          :empty-text="isSearching ? resolvedEmptySearchText : resolvedEmptyText"
          :listbox-id="listboxId"
          :is-open="combobox.isOpen.value"
          :active-descendant="actionGrid.activeDescendant.value"
          :mark="SelectionMark"
          @query="onPanelQuery"
          @keydown="popup.onSearchKeyDown"
          @select="onOptionClick"
        >
          <template v-if="slots.option" #option="slotProps">
            <slot name="option" v-bind="slotProps" />
          </template>
          <template v-if="slots.empty" #empty>
            <slot name="empty" />
          </template>
        </SelectorPanel>
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
