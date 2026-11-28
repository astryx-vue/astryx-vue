<script setup lang="ts">
import type { SelectorEmits, SelectorOption, SelectorProps, SelectorSlots } from './types.js'
import { computed, nextTick, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { useKeyboardHighlight } from '../composables/internal/useKeyboardHighlight.js'
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
import { useInputGroupContext, useInputGroupDisabled } from '../InputGroup/context.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useComponentMessages } from '../locale/context.js'
import { selectorMessages } from '../locale/messages/selector.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { assertOptionsArray } from '../selectors/assertOptions.js'
import { normalizeTriggerVariant } from '../selectors/triggerVariant.js'
import { useSize } from '../SizeContext/SizeContext.js'
import Spinner from '../Spinner/Spinner.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { searchResultMessage } from './searchResultMessage.js'
import { bindListboxEscape, dismissSelectorEscape, focusSelectorTrigger, onSelectorListboxEscape } from './selectorEscape.js'
import SelectorIcon from './SelectorIcon.js'
import { buildSelectorRows, flattenSelectorOptions, normalizeSelectorEntries } from './selectorOptions.js'
import SelectorPanel from './SelectorPanel.vue'
import { selectorFieldStatus, selectorStatusGlyph, selectorStatusType } from './selectorStatusRoles.js'
import { createTriggerActivation } from './triggerActivation.js'
import { selectorTriggerLabelledBy } from './triggerName.js'
import { useListboxOverlay } from './useListboxOverlay.js'
import { useListboxStyle } from './useListboxStyle.js'
import { useSelectorPopup } from './useSelectorPopup.js'
import { useSelectorSheet } from './useSelectorSheet.js'
import { useSelectorTexts } from './useSelectorTexts.js'
import '../../styles/button.css'
import '../../styles/layer.css'
import '../../styles/selector.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxSelector', inheritAttrs: false })

const props = withDefaults(defineProps<SelectorProps>(), {
  modelValue: null,
  disabled: false,
  status: 'default',
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
assertOptionsArray('Selector', props.options)
// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')

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
const messages = useComponentMessages({ selector: selectorMessages })
const { resolvedPlaceholder, resolvedSearchPlaceholder, resolvedClearLabel, valueClearLabel, resolvedEmptyText, resolvedEmptySearchText } = useSelectorTexts(props, messages)
const inputGroup = useInputGroupContext()
const inGroup = computed(() => inputGroup != null)
const groupDisabled = useInputGroupDisabled(() => props.disabled)
const control = useFieldControlState({
  disabled: () => groupDisabled.value,
  readOnly: () => props.isReadOnly,
  loading: () => props.isLoading,
})
const announce = useAnnounce()
const settleBusy = useBusyAnnouncement(() => control.isLoading.value, () => messages.value.selector.loading)
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
const sheetLabel = computed(() => props.label || resolvedPlaceholder.value)

const isEnabled = control.canActivate
const isSearchable = computed(() => props.searchable && control.canActivate.value)
/** 带搜索且不是只读时，触发器是普通按钮，搜索框才是组合框。 */
const isSearchTrigger = computed(() => props.searchable && !control.isReadOnly.value)

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
    // 选中后列表收起，焦点回到触发器，不留在已隐藏的选项或搜索框上。
    focusSelectorTrigger(fieldRef.value)
  },
  onOpenChange: (isOpen) => {
    if (isOpen && props.searchable) {
      nextTick(() => {
        panelRef.value?.focusSearch()
      })
    }
  },
})
const { isKeyboardHighlight } = useKeyboardHighlight(combobox.activeIndex)
const { isSheet, sheetOpen, popoverOpen, onSheetMotionComplete } = useSelectorSheet(() => props.presentation, combobox)

const { position, teleportTarget } = usePositionedLayer({
  anchor: fieldRef,
  layer: listboxRef,
  isOpen: popoverOpen,
  placement: computed(() => props.placement ?? 'below'),
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
  // 选项列表和弹出框一样：手指滑一下页面不关，只在外面轻点时关。
  dismissOnOutsidePan: false,
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
const statusType = computed(() => selectorStatusType(props.status))
const fieldStatus = computed(() => selectorFieldStatus(props.status, props.statusMessage))

const effectiveStatusVariant = computed(() => fieldStatusPlacement(props.variant, props.statusVariant))
const statusGlyph = computed(() => selectorStatusGlyph(statusType.value, effectiveStatusVariant.value))

const displayRows = computed(() => buildSelectorRows(normalizedEntries.value, combobox.filteredOptions.value))

const displayText = computed(() => {
  return selectedOption.value?.label ?? resolvedPlaceholder.value
})

const isEmpty = computed(() => {
  return combobox.filteredOptions.value.length === 0
})
const isSearching = computed(() => props.searchable && combobox.searchQuery.value.trim() !== '')
const showEmpty = computed(() => isEmpty.value && !control.isLoading.value)
const fieldLabelId = computed(() => `${selectorId.value}-label`)
const valueId = computed(() => `${selectorId.value}-value`)
/** 调用方的 aria-label 优先于字段标签。 */
const triggerAriaLabel = computed(() => {
  const external = attrs['aria-label']
  return typeof external === 'string' && external !== '' ? external : props.label
})
/** 带搜索的触发器是不带角色的按钮，读屏不念它的值，所以名字里接上所选的值。 */
const triggerLabelledBy = computed(() => selectorTriggerLabelledBy({
  fieldLabelId: fieldLabelId.value,
  valueId: valueId.value,
  groupLabelId: inGroup.value ? inputGroup?.labelId.value : undefined,
  callerLabelledBy: attrs['aria-labelledby'],
  includesValue: isSearchTrigger.value,
}))
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
  if (!message)
    return
  settleBusy() // 结果要播报了：还没念出去的「加载中」随即收回
  announce(message)
})

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

const { onClick: onTriggerClick, onKeyDown: onTriggerKeyDown } = createTriggerActivation({
  isDisabled: () => control.isDisabled.value,
  canActivate: () => control.canActivate.value,
  toggle: () => combobox.toggle(),
  emitClick: event => emit('click', event),
  onKeyDown: event => popup.onTriggerKeyDown(event),
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

const { overlayTop } = useListboxOverlay({
  fieldRef,
  listboxRef,
  isOpen: combobox.isOpen,
  position,
  value: () => props.modelValue,
  isEnabled: () => !props.searchable && !isSheet.value && props.placement == null,
})

const listboxStyle = useListboxStyle({ fieldRef, isOpen: combobox.isOpen, isSheet, overlayTop, position })
</script>

<template>
  <Field
    class="astryx-selector"
    :class="[parts.containerClass.value, `size-${size}`, `status-${statusType}`, `variant-${triggerVariant}`]"
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
      <SelectorIcon v-if="props.startIcon" class="astryx-selector-start-icon" :icon="props.startIcon" color="secondary" />
      <button
        v-bind="parts.forwardedAttrs()"
        :id="selectorId"
        type="button"
        class="astryx-selector-trigger"
        :class="{ 'is-open': combobox.isOpen.value, 'is-disabled': control.isDisabled.value }"
        :role="control.isReadOnly.value || !props.searchable ? 'combobox' : undefined"
        :aria-haspopup="popupKind"
        :aria-expanded="control.isReadOnly.value ? false : combobox.isOpen.value"
        :aria-controls="control.isReadOnly.value ? undefined : listboxId"
        :aria-readonly="control.isReadOnly.value || undefined"
        :aria-disabled="control.isDisabled.value || undefined"
        :aria-busy="control.isLoading.value || undefined"
        :aria-required="props.isRequired && !isSearchTrigger ? true : undefined"
        :aria-label="triggerAriaLabel"
        :aria-labelledby="triggerLabelledBy"
        :aria-describedby="describedBy"
        :aria-autocomplete="props.searchable ? undefined : 'none'"
        :aria-activedescendant="!props.searchable && !control.isReadOnly.value ? actionGrid.activeDescendant.value : undefined"
        @click="onTriggerClick"
        @focus="onTriggerFocus"
        @blur="disabledTooltip.onBlur"
        @keydown="onTriggerKeyDown"
      >
        <span :id="valueId" class="astryx-selector-value" :class="{ 'is-placeholder': !selectedOption, 'is-rich': slots.selected, 'is-grouped': inGroup }">
          <slot v-if="slots.selected" name="selected" :option="selectedOption" />
          <template v-else>
            <SelectorIcon v-if="!props.startIcon && selectedOption?.icon" class="astryx-selector-value-icon" :icon="selectedOption.icon" />
            <span class="astryx-selector-value-label">{{ displayText }}</span>
          </template>
        </span>
      </button>
      <Spinner v-if="control.isLoading.value" class="astryx-selector-spinner" size="sm" aria-hidden="true" />
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
      <Icon v-else-if="!control.isReadOnly.value" class="astryx-selector-icon" icon="chevronDown" size="sm" />
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
      @motion-complete="onSheetMotionComplete"
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
        :aria-label="fieldLabel"
        class="astryx-selector-listbox astryx-layer"
        :class="[{ 'is-sheet': isSheet, 'is-input': triggerVariant === 'input' }, `size-${size}`]"
        :data-placement="isSheet ? undefined : position.placement"
        :style="listboxStyle"
        :data-keyboard-highlight="isKeyboardHighlight || undefined"
        tabindex="-1"
      >
        <SelectorPanel
          ref="panelRef"
          :searchable="props.searchable"
          :required="props.isRequired"
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
