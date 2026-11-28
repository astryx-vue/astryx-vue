<script setup lang="ts" generic="T extends string">
import type { Reorderable, ReorderMove } from '@astryx-vue/core'
import type { Ref, StyleValue } from 'vue'
import type { PanelGroup, TransferListEmits, TransferListOption, TransferListProps, TransferListSlots } from './types.js'
import {
  unstable_adaptReorderable as adaptReorderable,
  createReorderable,
  unstable_reorderableOptions as reorderableOptions,
  Text,
  TextInput,
  transferListMessages,
  useAnnounce,
  useComponentMessages,
  VisuallyHidden,
} from '@astryx-vue/core'
import { computed, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { SearchIcon } from './icons.js'
import { groupOptions, matchesQuery, moveValue } from './transferItems.js'
import TransferListPanel from './TransferListPanel.vue'
import '../../styles/transfer-list.css'

defineOptions({ name: 'AstryxTransferList', inheritAttrs: false })

const props = withDefaults(defineProps<TransferListProps<T>>(), {
  modelValue: () => [],
  isLabelHidden: false,
  isDisabled: false,
  hasSearch: false,
  reorderable: undefined,
  isReorderable: true,
  hasSelectAll: false,
  hasClear: false,
})

const emit = defineEmits<TransferListEmits<T>>()
defineSlots<TransferListSlots<T>>()

const attrs = useAttrs()
const messages = useComponentMessages({ transferList: transferListMessages })
const announce = useAnnounce()

const labelId = `astryx-transfer-list-label-${useId()}`
const descriptionId = `astryx-transfer-list-description-${useId()}`
const selectedHeadingId = `astryx-transfer-list-selected-${useId()}`
const availableHeadingId = `astryx-transfer-list-available-${useId()}`

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
const searchRef = useTemplateRef<HTMLInputElement>('searchRef')
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

const selectedLabel = computed(() => props.selectedLabel ?? messages.value.transferList.selectedLabel)
const availableLabel = computed(() => props.availableLabel ?? messages.value.transferList.availableLabel)
const searchLabel = computed(() => props.searchLabel ?? messages.value.transferList.searchLabel(props.label))
const searchPlaceholder = computed(() => props.searchPlaceholder ?? messages.value.transferList.searchPlaceholder)
const selectedEmptyText = computed(() => props.selectedEmptyText ?? messages.value.transferList.selectedEmpty)
const availableEmptyText = computed(() => props.availableEmptyText ?? messages.value.transferList.availableEmpty)
const noResultsText = computed(() => props.noResultsText ?? messages.value.transferList.noResults)

/**
 * 整个列表禁用时，每个选项都搬不动，选项自己的说明不再适用。
 * 能不能调顺序仍按选项自己的设置：禁用的行留着灰掉的手柄，说明它为什么不动。
 */
const options = computed<readonly TransferListOption<T>[]>(() =>
  props.isDisabled
    ? props.options.map(option => ({ ...option, isTransferDisabled: true, disabledMessage: undefined }))
    : props.options,
)

const optionByValue = computed(() => {
  const map = new Map<T, TransferListOption<T>>()
  for (const option of options.value)
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
  return options.value.filter(option => !selectedValues.has(option.value) && matchesQuery(option, normalizedQuery.value))
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

/** `isReorderable` 的内置写法：挪动直接通过 `v-model` 和 `change` 交回去。 */
const builtInReorderable = createReorderable<T>({
  onReorder: ({ key, to }) => commit(moveValue(liveValue.value, key, to)),
})

/** 管顺序的对象：调用方给的 `reorderable`，或者 `isReorderable` 开着时的内置对象。 */
const owner = computed<Reorderable<T> | undefined>(() =>
  props.reorderable ?? (props.isReorderable ? builtInReorderable : undefined),
)

// 搜索过滤着面板时不重排：不然一行可能挪过藏起来的行。
const isOrdering = computed(() => owner.value != null && normalizedQuery.value === '')

/** 选项自己的 `isReorderDisabled` 和对象的 `isReorderable` 都同意，这一行才有手柄。 */
function canMove(optionValue: T): boolean {
  if (optionByValue.value.get(optionValue)?.isReorderDisabled === true)
    return false
  const source = owner.value
  return source == null || (reorderableOptions(source).isReorderable?.(optionValue) ?? true)
}

/**
 * List 报的是显示出来的行之间的挪动。把显示的行的新顺序填回它们在值里占的位置，
 * 再告诉调用方挪动的值在整个值里落到第几位。没有选项的值留在原位。
 */
function reorderSelected({ key, to }: ReorderMove<T>): void {
  const source = owner.value
  const shown = selectedOptions.value.map(option => option.value)
  const fromIndex = shown.indexOf(key)
  if (source == null || fromIndex < 0 || fromIndex === to || shown[to] == null)
    return
  const order = moveValue(shown, key, to)
  const isShown = new Set(shown)
  let next = 0
  const nextValue = liveValue.value.map(item => (isShown.has(item) ? order[next++]! : item))
  reorderableOptions(source).onReorder({ key, to: nextValue.indexOf(key) })
}

// 引擎是调用方对象自带的，这里不另外加载；调用方的 `start(key)` 也能找到这个列表。
const reorderable = computed(() => {
  const source = owner.value
  if (!isOrdering.value || source == null)
    return undefined
  return adaptReorderable(source, { onReorder: reorderSelected, isReorderable: canMove }) as Reorderable
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
  announce(messages.value.transferList.announceAdded(option.label, nextValue.length))
  focusAfterTransfer('available', index)
}

function removeOption(option: TransferListOption<T>, index: number): void {
  if (option.isTransferDisabled)
    return
  const nextValue = liveValue.value.filter(item => item !== option.value)
  commit(nextValue)
  announce(messages.value.transferList.announceRemoved(option.label, nextValue.length))
  focusAfterTransfer('selected', index)
}

function addAll(): void {
  const additions = options.value
    .filter(option => !option.isTransferDisabled && !liveValue.value.includes(option.value))
    .map(option => option.value)
  if (additions.length === 0)
    return
  commit([...liveValue.value, ...additions])
  announce(messages.value.transferList.announceBulkAdded(additions.length))
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
  announce(messages.value.transferList.announceBulkRemoved(removed))
}

function handleSearch(nextQuery: string): void {
  query.value = nextQuery
  const normalized = nextQuery.trim().toLowerCase()
  if (normalized === '') {
    announce('')
    return
  }
  const count = options.value.filter(option => matchesQuery(option, normalized)).length
  announce(messages.value.transferList.announceSearchResults(count))
}

const isClearDisabled = computed(() =>
  props.isDisabled || !props.modelValue.some(optionValue => !optionByValue.value.get(optionValue)?.isTransferDisabled),
)

const isAddAllDisabled = computed(() =>
  !options.value.some(option => !option.isTransferDisabled && !props.modelValue.includes(option.value)),
)

const describedBy = computed(() => {
  const ids = [attrs['aria-describedby'], props.description != null ? descriptionId : undefined].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const rootAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([key]) => !['class', 'style', 'role', 'aria-labelledby', 'aria-describedby'].includes(key)),
))

const labels = {
  addOption: (label: string) => messages.value.transferList.addOption(label),
  removeOption: (label: string) => messages.value.transferList.removeOption(label),
  transferDisabled: (label: string) => messages.value.transferList.transferDisabled(label),
  reorderDisabled: (label: string) => messages.value.transferList.reorderDisabled(label),
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
        :start-icon="SearchIcon" has-clear width="100%" :is-disabled="isDisabled"
        control-class="astryx-transfer-list__search" @update:model-value="handleSearch"
      />
    </div>

    <div class="astryx-transfer-list-collection">
      <TransferListPanel
        side="selected" :heading-id="selectedHeadingId" :label="selectedLabel"
        :show-action="hasClear" :action-label="messages.transferList.clear"
        :is-action-disabled="isClearDisabled" :groups="selectedGroups" :show-group-headings="false"
        :ungrouped-label="messages.transferList.ungroupedLabel"
        :empty-text="normalizedQuery === '' ? selectedEmptyText : noResultsText"
        :reorderable="reorderable" :is-ordering="isOrdering" :can-move="canMove" :is-disabled="isDisabled"
        :find-row="rowElement" :labels="labels"
        @action="clearSelected" @remove="removeOption"
      >
        <template v-if="$slots.option" #option="scope">
          <slot name="option" :option="scope.option" />
        </template>
      </TransferListPanel>

      <TransferListPanel
        side="available" :heading-id="availableHeadingId" :label="availableLabel"
        :show-action="hasSelectAll" :action-label="messages.transferList.addAll"
        :is-action-disabled="isAddAllDisabled" :groups="availableGroups" :show-group-headings="true"
        :ungrouped-label="messages.transferList.ungroupedLabel"
        :empty-text="normalizedQuery === '' ? availableEmptyText : noResultsText"
        :is-ordering="false" :can-move="canMove" :is-disabled="isDisabled"
        :find-row="rowElement" :labels="labels"
        @action="addAll" @add="addOption"
      >
        <template v-if="$slots.option" #option="scope">
          <slot name="option" :option="scope.option" />
        </template>
      </TransferListPanel>
    </div>
  </div>
</template>
