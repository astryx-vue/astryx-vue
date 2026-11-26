<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { MultiSelectorEmits, MultiSelectorHandle, MultiSelectorProps, MultiSelectorSlots, MultiSelectorTriggerProps } from './types.js'
import { computed, nextTick, onMounted, ref, shallowRef, useAttrs, useId, useTemplateRef } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { useBusyAnnouncement } from '../composables/internal/busyAnnouncement.js'
import { isKeyboardModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useDevWarning } from '../composables/useDevWarning.js'
import { useDisclosureHandle } from '../composables/useDisclosureHandle.js'
import { useFieldControlState } from '../composables/useFieldControlState.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import InputClearButton from '../Field/InputClearButton.vue'
import StatusGlyph from '../Field/StatusGlyph.vue'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { useInputGroupContext, useInputGroupDisabled } from '../InputGroup/context.js'
import { focusElement } from '../layer/focus.js'
import { useComponentMessages } from '../locale/context.js'
import { multiSelectorMessages } from '../locale/messages/multi-selector.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { bindListboxEscape } from '../Selector/selectorEscape.js'
import { useSelectorSheet } from '../Selector/useSelectorSheet.js'
import { normalizeTriggerVariant } from '../selectors/triggerVariant.js'
import { useSize } from '../SizeContext/SizeContext.js'
import Spinner from '../Spinner/Spinner.vue'
import Token from '../Token/Token.vue'
import { useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { consumeWhileDisabled } from '../utils/disabledInteraction.js'
import MultiSelectorPanel from './MultiSelectorPanel.vue'
import { useMultiSelectorDisplay } from './useMultiSelectorDisplay.js'
import { useMultiSelectorMenu } from './useMultiSelectorMenu.js'
import '../../styles/button.css'
import '../../styles/multi-selector.css'
import '../../styles/visually-hidden-utility.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxMultiSelector', inheritAttrs: false })

const props = withDefaults(defineProps<MultiSelectorProps>(), {
  modelValue: () => [],
  labelHidden: false,
  disabled: false,
  status: 'default',
  statusVariant: 'attached',
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

const slots = defineSlots<MultiSelectorSlots>()

// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')

const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'MultiSelector',
  props,
  attrs,
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete', 'aria-disabled', 'aria-required', 'aria-busy', 'aria-readonly'],
})
const triggerVariant = computed(() => normalizeTriggerVariant(props.variant))

const CheckboxMark = useIndicator('checkbox')

const messages = useComponentMessages({ multiSelector: multiSelectorMessages })
const announce = useAnnounce()
const inputGroup = useInputGroupContext()
const inGroup = computed(() => inputGroup != null)
const groupDisabled = useInputGroupDisabled(() => props.disabled)
const control = useFieldControlState({
  disabled: () => groupDisabled.value,
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
useScrollbars(listboxRef)
const readOnlyId = `${triggerId}-readonly`
const disabledTooltipId = `${triggerId}-disabled-tooltip`
/** 旧名 disabledReason 和新名 disabledMessage 等价。 */
const resolvedDisabledMessage = computed(() => props.disabledMessage?.trim() || props.disabledReason?.trim())
const showsDisabledMessage = computed(() => control.isDisabled.value && !!resolvedDisabledMessage.value)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
const fieldLabelId = `${triggerId}-label`
const hasClear = computed(() => props.hasClear || props.clearable)
const hasCustomTrigger = computed(() => slots.trigger != null)
const customAnchor = shallowRef<HTMLElement | null>(null)
const anchor = computed(() => customAnchor.value ?? anchorRef.value)

function setCustomTrigger(element: unknown): void {
  customAnchor.value = element instanceof HTMLElement ? element : null
}
const placeholder = computed(() => props.placeholder ?? messages.value.multiSelector.placeholder)
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

const panelRef = useTemplateRef<{ focusSearch: () => void }>('panelRef')
const menu = useMultiSelectorMenu({
  props,
  emitUpdate: value => emit('update:modelValue', value),
  emitChange: (value, change) => emit('change', value, change),
  emitSearch: value => emit('search', value),
  emitOpenChange: isOpen => emit('openChange', isOpen),
  canActivate: control.canActivate,
  isLoading: control.isLoading,
  messages,
  announce,
  settleBusy: useBusyAnnouncement(() => control.isLoading.value, () => messages.value.multiSelector.loading),
  listboxRef,
  getSearchInput: () => panelRef.value ? (panelRef.value as { searchInput?: HTMLInputElement | null }).searchInput ?? null : null,
  focusTrigger: () => {
    const trigger = triggerRef.value ?? customAnchor.value
    if (trigger != null)
      void nextTick(() => focusElement(trigger))
  },
  listboxId,
})
const { combobox, selectedValues, selectedOptions } = menu
/** 禁用的字段不向表单交值：不渲染隐藏输入，而不是渲染一个原生禁用的。 */
/** 带搜索时触发器是普通按钮，搜索框才是组合框；ARIA 不允许按钮带 aria-required，必填交给搜索框。 */
const hasSearchRole = computed(() => Boolean(props.searchable) && !control.isReadOnly.value)
const hiddenCarrierValues = computed(() => control.isDisabled.value ? [] : selectedValues.value)

trackInteractionModality()
const searchKeyboardFocus = ref(false)
const sheetSlot = useTemplateRef<HTMLElement>('sheetSlot')
const { isSheet, sheetOpen, popoverOpen, onSheetMotionComplete } = useSelectorSheet(() => props.presentation, combobox)
const listboxTarget = computed(() => isSheet.value && sheetSlot.value ? sheetSlot.value : 'body')

function onSearchFocus(): void {
  searchKeyboardFocus.value = isKeyboardModality()
}

function onSearchBlur(): void {
  searchKeyboardFocus.value = false
}

const anchored = useAnchoredListbox({
  anchor,
  layer: listboxRef,
  isOpen: popoverOpen,
  onDismiss: () => {
    combobox.close()
  },
})

const { overflow, visibleBadgeCount, hiddenBadgeCount, measureMoreLabel, labelText, formattedValue } = useMultiSelectorDisplay({
  props,
  selectedOptions,
  messages,
})
/** 调用方的 aria-labelledby 接在字段自己的标签后面（组内先是组标签），不取代它。 */
const labelledBy = computed(() => {
  const external = attrs['aria-labelledby']
  if (typeof external !== 'string' || external === '')
    return undefined
  return [inGroup.value ? inputGroup?.labelId.value : undefined, fieldLabelId, external].filter(Boolean).join(' ')
})
const describedBy = computed(() => {
  return [
    inGroup.value ? inputGroup?.describedBy.value : undefined,
    !inGroup.value && props.description ? `${triggerId}-description` : undefined,
    !inGroup.value && props.statusMessage ? `${triggerId}-status` : undefined,
    showsDisabledMessage.value ? disabledId : undefined,
  ].filter(Boolean).join(' ') || undefined
})

useDevWarning(
  'MultiSelector',
  '`containerClass`/`containerStyle` have no effect on a custom trigger.',
  () => hasCustomTrigger.value && (props.containerClass != null || props.containerStyle != null),
)
useDevWarning(
  'MultiSelector',
  '`controlClass`/`controlStyle` have no effect on a custom trigger.',
  () => hasCustomTrigger.value && (props.controlClass != null || props.controlStyle != null),
)

/**
 * 禁用态用 `aria-disabled` 表达，触发器仍留在 Tab 序列里（spec:AST-085 FR1）。
 * 原生 `disabled` 不会派发事件，换成 aria 之后要自己挡住指针和按键（FR2）。
 */
function onTriggerClick(event: MouseEvent): void {
  if (consumeWhileDisabled(event, control.isDisabled.value))
    return
  if (control.canActivate.value)
    combobox.toggle()
  emit('click', event)
}

function onTriggerFocus(event: FocusEvent): void {
  emit('focus', event)
  disabledTooltip.onFocus(event)
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (consumeWhileDisabled(event, control.isDisabled.value))
    return
  menu.onKeyDown(event)
  if (!event.defaultPrevented)
    emit('keydown', event)
}

/** 选项和操作按钮上的 Escape 不会经过搜索框，在列表根上接住并回到触发器。 */
bindListboxEscape(listboxRef, (event) => {
  if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing)
    return
  menu.onKeyDown(event)
})

/**
 * 自制控件在禁用、只读（含 InputGroup 带来的禁用）时仍可聚焦，但调用方绑在同一个
 * 元素上的点击和按键处理也不该运行：先到的这一份把事件整个拦下。
 */
function onCustomTriggerClick(event: MouseEvent): void {
  if (!control.canActivate.value)
    event.stopImmediatePropagation()
  onTriggerClick(event)
}

function onCustomTriggerKeyDown(event: KeyboardEvent): void {
  if (!control.canActivate.value && event.key !== 'Tab')
    event.stopImmediatePropagation()
  onTriggerKeyDown(event)
}

const triggerProps = computed<MultiSelectorTriggerProps>(() => ({
  'id': triggerId,
  'onClick': onCustomTriggerClick,
  'onKeyDown': onCustomTriggerKeyDown,
  'onFocus': onTriggerFocus,
  'aria-disabled': control.isDisabled.value ? 'true' : undefined,
  'aria-haspopup': menu.popupKind.value,
  'aria-expanded': combobox.isOpen.value,
  'aria-controls': listboxId,
  'aria-busy': control.isLoading.value ? true : undefined,
  'triggerRef': setCustomTrigger,
}))

onMounted(() => {
  if (!props.isDefaultOpen)
    return
  menu.openFromMount()
})

const handle: MultiSelectorHandle = {
  open: () => menu.open(),
  close: () => menu.close(),
  toggle: () => {
    if (combobox.isOpen.value)
      menu.close()
    else
      menu.open()
  },
  isOpen: () => combobox.isOpen.value,
}
useDisclosureHandle(() => props.handleRef, handle)

defineExpose({
  focus: () => {
    if (props.searchable && combobox.isOpen.value)
      panelRef.value?.focusSearch()
    else
      anchor.value?.focus()
  },
  blur: () => anchor.value?.blur(),
  ...handle,
})
</script>

<template>
  <slot v-if="hasCustomTrigger" name="trigger" v-bind="triggerProps" />
  <Field
    v-else
    class="astryx-multi-selector"
    :class="[parts.containerClass.value, `size-${size}`, `variant-${triggerVariant}`]"
    :style="parts.containerStyle.value"
    :label="props.label"
    :input-id="props.searchable && combobox.isOpen.value ? searchId : triggerId"
    :label-id="fieldLabelId"
    :is-label-hidden="inGroup || props.isLabelHidden || props.labelHidden"
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
      :class="[parts.controlClass(), `status-${props.status}`, {
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
      <span v-if="$slots.icon" class="astryx-multi-selector-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <button
        v-bind="parts.forwardedAttrs()"
        :id="triggerId"
        ref="triggerRef"
        type="button"
        class="astryx-multi-selector-trigger"
        :aria-disabled="control.isDisabled.value || undefined"
        :aria-readonly="control.isReadOnly.value || undefined"
        :aria-busy="control.isLoading.value || undefined"
        :role="hasSearchRole ? undefined : 'combobox'"
        :aria-haspopup="control.isReadOnly.value ? undefined : menu.popupKind.value"
        :aria-expanded="control.isReadOnly.value ? false : combobox.isOpen.value"
        :aria-controls="control.isReadOnly.value ? undefined : listboxId"
        :aria-autocomplete="props.searchable ? undefined : 'none'"
        :aria-activedescendant="!props.searchable ? menu.actionGrid.activeDescendant.value : undefined"
        :aria-labelledby="labelledBy"
        :aria-required="props.required && !hasSearchRole ? true : undefined"
        :aria-describedby="[describedBy, control.isReadOnly.value ? readOnlyId : undefined].filter(Boolean).join(' ') || undefined"
        @click="onTriggerClick"
        @focus="onTriggerFocus"
        @blur="disabledTooltip.onBlur"
        @keydown="onTriggerKeyDown"
      >
        <span v-if="selectedOptions.length === 0" class="astryx-multi-selector-placeholder">{{ placeholder }}</span>
        <span v-else-if="props.triggerDisplay === 'count'" class="astryx-multi-selector-value">{{ formattedValue ?? messages.multiSelector.selected(selectedOptions.length) }}</span>
        <span v-else-if="props.triggerDisplay === 'labels'" class="astryx-multi-selector-value">{{ formattedValue ?? labelText }}</span>
        <span v-else :ref="overflow.containerRef" class="astryx-multi-selector-badges">
          <Token
            v-for="option in selectedOptions.slice(0, visibleBadgeCount)"
            :key="option.value"
            :label="option.label"
            :size="size === 'lg' ? 'md' : 'sm'"
          />
          <span v-if="hiddenBadgeCount > 0" class="astryx-multi-selector-more">
            {{ messages.multiSelector.more(hiddenBadgeCount) }}
          </span>
        </span>
      </button>
      <Spinner v-if="control.isLoading.value" class="astryx-multi-selector-spinner" size="sm" aria-hidden="true" />
      <InputClearButton
        v-if="hasClear && selectedValues.length > 0 && control.canActivate.value"
        class="astryx-multi-selector-clear"
        :label="messages.multiSelector.clearAll(props.label)"
        @click.stop="menu.commit([])"
      />
      <StatusGlyph
        v-if="statusGlyph"
        :type="statusGlyph"
        :message="fieldStatus?.message"
        :tooltip="effectiveStatusVariant === 'tooltip'"
      />
      <Icon v-else-if="!control.isReadOnly.value" class="astryx-multi-selector-chevron" :class="{ 'is-open': combobox.isOpen.value }" icon="chevronDown" size="sm" />
      <span v-if="control.isReadOnly.value" :id="readOnlyId" class="astryx-visually-hidden">{{ messages.multiSelector.readOnly }}</span>
      <span v-if="props.triggerDisplay === 'badges'" :ref="overflow.measureRef" class="astryx-multi-selector-measure" aria-hidden="true">
        <Token
          v-for="option in selectedOptions"
          :key="option.value"
          :label="option.label"
          :size="size === 'lg' ? 'md' : 'sm'"
        />
        <span class="astryx-multi-selector-more" data-overflow-indicator>{{ measureMoreLabel }}</span>
      </span>
      <span v-if="showsDisabledMessage" :id="disabledId" class="astryx-visually-hidden">{{ resolvedDisabledMessage }}</span>
      <input v-for="value in hiddenCarrierValues" :key="value" type="hidden" :name="props.name" :value="value" :disabled="!props.name">
    </div>
  </Field>
  <BottomSheet
    v-if="isSheet"
    v-model:is-open="sheetOpen"
    height="hug"
    :label="props.label"
    :padding="2"
    @motion-complete="onSheetMotionComplete"
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
      class="astryx-multi-selector-listbox astryx-layer"
      :data-keyboard-highlight="menu.isKeyboardHighlight.value || undefined"
      :class="{ 'is-sheet': isSheet }"
      :role="menu.gridMode.value ? 'grid' : 'listbox'"
      aria-multiselectable="true"
      :aria-label="props.label"
      :data-placement="isSheet ? undefined : anchored.position.value.placement"
      :style="isSheet ? undefined : anchored.style.value"
      tabindex="-1"
    >
      <MultiSelectorPanel
        ref="panelRef"
        :searchable="Boolean(props.searchable)"
        :required="props.required"
        :query="menu.query.value"
        :search-id="searchId"
        :search-placeholder="menu.searchPlaceholder.value"
        :clear-label="messages.multiSelector.clear"
        :listbox-id="listboxId"
        :active-index="combobox.activeIndex.value"
        :active-descendant="menu.actionGrid.activeDescendant.value"
        :grid="menu.gridMode.value"
        :action-index="menu.actionGrid.column.value === 'action' ? combobox.activeIndex.value : -1"
        :create-option="menu.createOption.value"
        :select-all="Boolean(props.selectAll)"
        :select-all-index="menu.selectAllIndex.value"
        :select-all-label="menu.selectAllLabel.value"
        :select-all-state="menu.selectAllState.value"
        :checkbox-position="props.checkboxPosition"
        :size="size"
        :loading="control.isLoading.value"
        :real-match-count="menu.realMatchCount.value"
        :rows="menu.rows.value"
        :show-empty="menu.showEmpty.value"
        :empty-text="menu.emptyText.value"
        :empty-search-text="menu.emptySearchText.value"
        :search-keyboard-focus="searchKeyboardFocus"
        :mark="CheckboxMark"
        :is-selected="menu.isSelected"
        :checkbox-state="menu.checkboxState"
        :option-index="menu.optionIndex"
        :option-dom-id="menu.optionDomId"
        :action-dom-id="(index) => `${listboxId}-action-${index}`"
        @query="menu.onSearchInput"
        @keydown="menu.onKeyDown"
        @clear-query="menu.query.value = ''"
        @search-focus="onSearchFocus"
        @search-blur="onSearchBlur"
        @toggle="menu.toggleValue"
        @highlight="menu.highlight"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </MultiSelectorPanel>
    </div>
  </Teleport>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="disabledTooltipId"
    :anchor="anchor"
    :open="disabledTooltip.isOpen.value"
    :text="resolvedDisabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
</template>
