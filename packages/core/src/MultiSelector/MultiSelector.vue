<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { MultiSelectorEmits, MultiSelectorHandle, MultiSelectorProps, MultiSelectorSlots, MultiSelectorTriggerProps } from './types.js'
import { computed, onMounted, ref, shallowRef, useAttrs, useId, useTemplateRef } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { useButtonTooltip } from '../Button/useButtonTooltip.js'
import { isKeyboardModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useDevWarning } from '../composables/useDevWarning.js'
import { useDisclosureHandle } from '../composables/useDisclosureHandle.js'
import { useFieldControlState } from '../composables/useFieldControlState.js'
import { useOverflow } from '../composables/useOverflow.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import StatusGlyph from '../Field/StatusGlyph.vue'
import { fieldStatusPlacement } from '../Field/statusPlacement.js'
import Icon from '../Icon/Icon.vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { useInputGroupContext } from '../InputGroup/context.js'
import { useAstryxMessages } from '../locale/index.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { normalizeTriggerVariant } from '../selectors/triggerVariant.js'
import Spinner from '../Spinner/Spinner.vue'
import Token from '../Token/Token.vue'
import { useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import MultiSelectorPanel from './MultiSelectorPanel.vue'
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
const slots = defineSlots<MultiSelectorSlots>()
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'MultiSelector',
  props,
  attrs,
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete', 'aria-disabled', 'aria-required', 'aria-busy', 'aria-readonly'],
})
const triggerVariant = computed(() => normalizeTriggerVariant(props.variant))

const CheckboxMark = useIndicator('checkbox')

const messages = useAstryxMessages()
const announce = useAnnounce()
const inputGroup = useInputGroupContext()
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
useScrollbars(listboxRef)
const readOnlyId = `${triggerId}-readonly`
const disabledTooltipId = `${triggerId}-disabled-tooltip`
/** 旧名 disabledReason 和新名 disabledMessage 等价。 */
const resolvedDisabledMessage = computed(() => props.disabledMessage?.trim() || props.disabledReason?.trim())
const showsDisabledMessage = computed(() => control.isDisabled.value && !!resolvedDisabledMessage.value)
const disabledTooltip = useButtonTooltip(showsDisabledMessage)
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
  listboxRef,
  getSearchInput: () => panelRef.value ? (panelRef.value as { searchInput?: HTMLInputElement | null }).searchInput ?? null : null,
  focusTrigger: () => triggerRef.value?.focus(),
  listboxId,
})
const { combobox, selectedValues, selectedOptions } = menu

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
  anchor,
  layer: listboxRef,
  isOpen: computed(() => combobox.isOpen.value && !isSheet.value),
  onDismiss: () => {
    combobox.close()
  },
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

function onTriggerClick(event: MouseEvent): void {
  if (control.canActivate.value)
    combobox.toggle()
  emit('click', event)
}

function onTriggerFocus(event: FocusEvent): void {
  emit('focus', event)
  disabledTooltip.onFocus(event)
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  menu.onKeyDown(event)
  if (!event.defaultPrevented)
    emit('keydown', event)
}

const triggerProps = computed<MultiSelectorTriggerProps>(() => ({
  'id': triggerId,
  'onClick': onTriggerClick,
  'onKeyDown': onTriggerKeyDown,
  'onFocus': onTriggerFocus,
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
    :class="[parts.containerClass.value, `size-${props.size}`, `variant-${triggerVariant}`]"
    :style="parts.containerStyle.value"
    :label="props.label"
    :input-id="props.searchable && combobox.isOpen.value ? searchId : triggerId"
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
        :disabled="control.isDisabled.value && !showsDisabledMessage"
        :aria-disabled="showsDisabledMessage ? 'true' : undefined"
        :aria-readonly="control.isReadOnly.value || undefined"
        :aria-busy="control.isLoading.value || undefined"
        :role="props.searchable && !control.isReadOnly.value ? undefined : 'combobox'"
        :aria-haspopup="control.isReadOnly.value ? undefined : menu.popupKind.value"
        :aria-expanded="control.isReadOnly.value ? false : combobox.isOpen.value"
        :aria-controls="control.isReadOnly.value ? undefined : listboxId"
        :aria-autocomplete="props.searchable ? undefined : 'none'"
        :aria-activedescendant="!props.searchable ? menu.actionGrid.activeDescendant.value : undefined"
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
            :size="props.size === 'lg' ? 'md' : 'sm'"
          />
          <span v-if="hiddenBadgeCount > 0" class="astryx-multi-selector-more">
            {{ messages.multiSelector.more(hiddenBadgeCount) }}
          </span>
        </span>
      </button>
      <Spinner v-if="control.isLoading.value" class="astryx-multi-selector-spinner" size="sm" :aria-label="messages.multiSelector.loading" />
      <button
        v-if="hasClear && selectedValues.length > 0 && control.canActivate.value"
        type="button"
        class="astryx-multi-selector-clear"
        :aria-label="messages.multiSelector.clearAll(props.label)"
        @click.stop="menu.commit([])"
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
      <span v-if="showsDisabledMessage" :id="disabledId" class="astryx-visually-hidden">{{ resolvedDisabledMessage }}</span>
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
      class="astryx-multi-selector-listbox astryx-layer"
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
        :size="props.size"
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
