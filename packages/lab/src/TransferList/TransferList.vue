<script setup lang="ts" generic="T extends string">
import type { Ref, StyleValue } from 'vue'
import type { PanelGroup, TransferListEmits, TransferListOption, TransferListProps, TransferListSlots } from './types.js'
import { Text, TextInput, useAnnounce, useTranslator, VisuallyHidden } from '@astryx-vue/core'
import { computed, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { SearchIcon } from '../MobileTokenizer/icons.js'
import { groupOptions, matchesQuery } from './transferItems.js'
import TransferListPanel from './TransferListPanel.vue'
import { useTransferReorder } from './useTransferReorder.js'
import '../../styles/transfer-list.css'

defineOptions({ name: 'AstryxTransferList', inheritAttrs: false })

const props = withDefaults(defineProps<TransferListProps<T>>(), {
  modelValue: () => [],
  isLabelHidden: false,
  hasSearch: false,
  isReorderable: true,
  hasSelectAll: false,
  hasClear: false,
})

const emit = defineEmits<TransferListEmits<T>>()
defineSlots<TransferListSlots<T>>()

const attrs = useAttrs()
const { t } = useTranslator()
const announce = useAnnounce()

const labelId = `astryx-transfer-list-label-${useId()}`
const descriptionId = `astryx-transfer-list-description-${useId()}`
const selectedHeadingId = `astryx-transfer-list-selected-${useId()}`
const availableHeadingId = `astryx-transfer-list-available-${useId()}`
const reorderInstructionsId = `astryx-transfer-list-reorder-${useId()}`

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
const searchRef = useTemplateRef<HTMLInputElement>('searchRef')
const previewHost = ref<HTMLElement | null>(null)
const query = ref('')

/** 提交之后 props 才会回来，中间的连点读不到最新值，这里留一份同步的顺序。 */
const liveValue = ref<readonly T[]>([...props.modelValue]) as Ref<readonly T[]>
watch(() => props.modelValue, (next) => {
  liveValue.value = [...next]
})

function commit(next: readonly T[]): void {
  liveValue.value = [...next]
  emit('update:modelValue', next)
  emit('change', next)
}

const selectedLabel = computed(() => props.selectedLabel ?? t('@astryx.transferList.selectedLabel'))
const availableLabel = computed(() => props.availableLabel ?? t('@astryx.transferList.availableLabel'))
const searchLabel = computed(() => props.searchLabel ?? t('@astryx.transferList.searchLabel', { label: props.label }))
const searchPlaceholder = computed(() => props.searchPlaceholder ?? t('@astryx.transferList.searchPlaceholder'))
const selectedEmptyText = computed(() => props.selectedEmptyText ?? t('@astryx.transferList.selectedEmpty'))
const availableEmptyText = computed(() => props.availableEmptyText ?? t('@astryx.transferList.availableEmpty'))
const noResultsText = computed(() => props.noResultsText ?? t('@astryx.transferList.noResults'))

const optionByValue = computed(() => {
  const map = new Map<T, TransferListOption<T>>()
  for (const option of props.options)
    map.set(option.value, option)
  return map
})

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const selectedOptions = computed<TransferListOption<T>[]>(() =>
  props.modelValue
    .map(optionValue => optionByValue.value.get(optionValue))
    .filter((option): option is TransferListOption<T> => option != null && matchesQuery(option, normalizedQuery.value)),
)

const availableOptions = computed<TransferListOption<T>[]>(() => {
  const selectedValues = new Set(props.modelValue)
  return props.options.filter(option => !selectedValues.has(option.value) && matchesQuery(option, normalizedQuery.value))
})

const selectedGroups = computed<PanelGroup<T>[]>(() => [{
  group: '',
  options: selectedOptions.value.map((option, index) => ({ option, index })),
}])

const availableGroups = computed<PanelGroup<T>[]>(() =>
  groupOptions(availableOptions.value).map(([group, options]) => ({
    group,
    options: options.map(option => ({ option, index: availableOptions.value.indexOf(option) })),
  })),
)

function rowElement(value: T): HTMLElement | null {
  const rows = rootRef.value?.querySelectorAll<HTMLElement>('[data-transfer-list-row]')
  if (rows == null)
    return null
  for (const row of rows) {
    if (row.dataset.transferListRow === value)
      return row
  }
  return null
}

const reorder = useTransferReorder<T>({
  isReorderable: () => props.isReorderable,
  currentValue: () => liveValue.value,
  optionByValue: () => optionByValue.value,
  rowElement,
  previewHost,
  commit,
  announce,
  messages: {
    grabbed: (label, position, total) => t('@astryx.transferList.announceGrabbed', { label, position, total }),
    moveCancelled: label => t('@astryx.transferList.announceMoveCancelled', { label }),
    dropped: (label, position, total) => t('@astryx.transferList.announceDropped', { label, position, total }),
    returned: (label, position) => t('@astryx.transferList.announceReturned', { label, position }),
    movedToPosition: (label, position, total) => t('@astryx.transferList.announceMovedToPosition', { label, position, total }),
  },
})

/** 转移之后把焦点交回同侧的下一行，没有可聚焦的就退回搜索框或面板本身。 */
function focusAfterTransfer(side: 'selected' | 'available', index: number): void {
  const moveFocus = (): void => {
    const panel = rootRef.value?.querySelector<HTMLElement>(`.astryx-transfer-list-panel[data-side="${side}"]`)
    const actions = panel?.querySelectorAll<HTMLButtonElement>(
      `[data-transfer-list-action="${side}"]:not([disabled]):not([aria-disabled="true"])`,
    )
    if (actions != null && actions.length > 0)
      actions[Math.min(index, actions.length - 1)]?.focus()
    else if (props.hasSearch)
      searchRef.value?.focus()
    else
      panel?.focus()
  }
  if (typeof requestAnimationFrame === 'function')
    requestAnimationFrame(moveFocus)
  else
    setTimeout(moveFocus, 0)
}

function addOption(option: TransferListOption<T>, index: number): void {
  if (option.isTransferDisabled || liveValue.value.includes(option.value))
    return
  const nextValue = [...liveValue.value, option.value]
  commit(nextValue)
  announce(t('@astryx.transferList.announceAdded', { label: option.label, count: nextValue.length }))
  focusAfterTransfer('available', index)
}

function removeOption(option: TransferListOption<T>, index: number): void {
  if (option.isTransferDisabled)
    return
  const nextValue = liveValue.value.filter(item => item !== option.value)
  commit(nextValue)
  announce(t('@astryx.transferList.announceRemoved', { label: option.label, count: nextValue.length }))
  focusAfterTransfer('selected', index)
}

function addAll(): void {
  const additions = props.options
    .filter(option => !option.isTransferDisabled && !liveValue.value.includes(option.value))
    .map(option => option.value)
  if (additions.length === 0)
    return
  commit([...liveValue.value, ...additions])
  announce(t('@astryx.transferList.announceBulkAdded', { count: additions.length }))
}

function clearSelected(): void {
  const nextValue = liveValue.value.filter((optionValue) => {
    const option = optionByValue.value.get(optionValue)
    return option == null || option.isTransferDisabled
  })
  const removed = liveValue.value.length - nextValue.length
  if (removed === 0)
    return
  commit(nextValue)
  announce(t('@astryx.transferList.announceBulkRemoved', { count: removed }))
}

function handleSearch(nextQuery: string): void {
  query.value = nextQuery
  const normalized = nextQuery.trim().toLowerCase()
  if (normalized === '') {
    announce('')
    return
  }
  const count = props.options.filter(option => matchesQuery(option, normalized)).length
  announce(t('@astryx.transferList.announceSearchResults', { count }))
}

const isClearDisabled = computed(() =>
  !props.modelValue.some(optionValue => !optionByValue.value.get(optionValue)?.isTransferDisabled),
)

const isAddAllDisabled = computed(() =>
  !props.options.some(option => !option.isTransferDisabled && !props.modelValue.includes(option.value)),
)

const describedBy = computed(() => {
  const ids = [attrs['aria-describedby'], props.description != null ? descriptionId : undefined].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const rootAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !['class', 'style', 'role', 'aria-labelledby', 'aria-describedby'].includes(key)),
))

const labels = {
  addOption: (label: string) => t('@astryx.transferList.addOption', { label }),
  removeOption: (label: string) => t('@astryx.transferList.removeOption', { label }),
  reorderOption: (label: string) => t('@astryx.transferList.reorderOption', { label }),
  transferDisabled: (label: string) => t('@astryx.transferList.transferDisabled', { label }),
  reorderDisabled: (label: string) => t('@astryx.transferList.reorderDisabled', { label }),
}

const handlers = {
  click: reorder.onHandleClick,
  keydown: reorder.onHandleKeydown,
  pointerdown: reorder.onHandlePointerDown,
  pointermove: reorder.onHandlePointerMove,
  pointerup: reorder.onHandlePointerUp,
  pointercancel: reorder.onHandlePointerCancel,
  lostpointercapture: reorder.onHandleLostPointerCapture,
}
</script>

<template>
  <div
    ref="rootRef" v-bind="rootAttrs" class="astryx-transfer-list" :class="attrs.class" :style="attrs.style as StyleValue"
    :role="(attrs.role as string | undefined) ?? 'group'"
    :aria-labelledby="(attrs['aria-labelledby'] as string | undefined) ?? labelId" :aria-describedby="describedBy"
  >
    <div class="astryx-transfer-list__heading">
      <VisuallyHidden v-if="isLabelHidden" :id="labelId">
        {{ label }}
      </VisuallyHidden>
      <Text v-else :id="labelId" type="label" display="block">
        {{ label }}
      </Text>
      <Text v-if="description != null" :id="descriptionId" type="supporting" display="block">
        {{ description }}
      </Text>
    </div>

    <div v-if="hasSearch" class="astryx-transfer-list__controls">
      <TextInput
        :model-value="query" role="searchbox" :label="searchLabel" is-label-hidden :placeholder="searchPlaceholder"
        :start-icon="SearchIcon" has-clear width="100%"
        control-class="astryx-transfer-list__search" @update:model-value="handleSearch"
      />
    </div>

    <VisuallyHidden :id="reorderInstructionsId">
      {{ t('@astryx.transferList.reorderInstructions') }}
    </VisuallyHidden>

    <div class="astryx-transfer-list-collection">
      <TransferListPanel
        side="selected" :heading-id="selectedHeadingId" :label="selectedLabel"
        :show-action="hasClear" :action-label="t('@astryx.transferList.clear')"
        :is-action-disabled="isClearDisabled" :groups="selectedGroups" :show-group-headings="false"
        :ungrouped-label="t('@astryx.transferList.ungroupedLabel')"
        :empty-text="normalizedQuery === '' ? selectedEmptyText : noResultsText"
        :is-reorderable="isReorderable" :dragging-value="reorder.draggingValue.value"
        :grabbed-value="reorder.grabbedValue.value" :drop-target="reorder.pointerPlacement.value"
        :reorder-instructions-id="reorderInstructionsId" :labels="labels" :handlers="handlers"
        @action="clearSelected" @remove="removeOption"
      >
        <template v-if="$slots.option" #option="scope">
          <slot name="option" :option="scope.option" />
        </template>
      </TransferListPanel>

      <TransferListPanel
        side="available" :heading-id="availableHeadingId" :label="availableLabel"
        :show-action="hasSelectAll" :action-label="t('@astryx.transferList.addAll')"
        :is-action-disabled="isAddAllDisabled" :groups="availableGroups" :show-group-headings="true"
        :ungrouped-label="t('@astryx.transferList.ungroupedLabel')"
        :empty-text="normalizedQuery === '' ? availableEmptyText : noResultsText"
        :is-reorderable="false" :dragging-value="null" :grabbed-value="null" :drop-target="null"
        :reorder-instructions-id="reorderInstructionsId" :labels="labels" :handlers="handlers"
        @action="addAll" @add="addOption"
      >
        <template v-if="$slots.option" #option="scope">
          <slot name="option" :option="scope.option" />
        </template>
      </TransferListPanel>
    </div>

    <Teleport to="body">
      <div
        v-if="reorder.previewStyle.value != null" ref="previewHost"
        class="astryx-transfer-list-drag-preview" data-transfer-list-drag-preview
        aria-hidden="true" :style="reorder.previewStyle.value"
      />
    </Teleport>
  </div>
</template>
