<script setup lang="ts" generic="T">
import type { Reorderable } from '@astryx-vue/core'
import type { ListInputChange, ListInputEmits, ListInputProps } from './types.js'
import {
  Button,
  createReorderable,
  EmptyState,
  Field,
  listInputMessages,
  unstable_ListReorderScope as ListReorderScope,
  useAnnounce,
  useComponentMessages,
  useDevWarning,
  unstable_useListReorderScope as useListReorderScope,
} from '@astryx-vue/core'
import { computed, ref, useId, useTemplateRef, watch } from 'vue'
import { moveItem, resolveGridTemplate } from './columns.js'
import ListInputRow from './ListInputRow.vue'
import '../../styles/list-input.css'

defineOptions({ name: 'AstryxListInput', inheritAttrs: false })

const props = withDefaults(defineProps<ListInputProps<T>>(), {
  modelValue: () => [],
  itemName: 'item',
  reorderable: undefined,
  isReorderable: false,
  isDisabled: false,
  isLoading: false,
  isLabelHidden: false,
  isOptional: false,
  isRequired: false,
  description: undefined,
  status: undefined,
  getItemStatus: undefined,
  getFieldStatus: undefined,
  maxItems: undefined,
})

const emit = defineEmits<ListInputEmits<T>>()
const messages = useComponentMessages({ listInput: listInputMessages })
const announce = useAnnounce()

const uid = useId()
const groupId = `list-input-${uid}`
const labelId = `${groupId}-label`
const descriptionId = computed(() => (props.description ? `${groupId}-description` : undefined))
const statusId = computed(() => (props.status?.message ? `${groupId}-status` : undefined))
const reorderInstructionsId = `${groupId}-reorder-instructions`

const groupRef = useTemplateRef<HTMLDivElement>('groupRef')
const listRef = useTemplateRef<HTMLOListElement>('listRef')
const addButtonRef = useTemplateRef<{ element: HTMLElement | null }>('addButtonRef')

const itemKeyOf = (item: T): string => String(props.getItemKey(item))
const mutationsDisabled = computed(() => props.isDisabled || props.isLoading)
const hasReachedMax = computed(() => props.maxItems != null && props.modelValue.length >= props.maxItems)
const gridTemplate = computed(() => resolveGridTemplate(props.columns))

/** 提交之后 props 才会回来，中间的连点读不到最新值，这里留一份同步的顺序。 */
const liveValue = ref<T[]>([...props.modelValue]) as { value: T[] }
watch(() => props.modelValue, (next) => {
  liveValue.value = [...next]
})

const labels = {
  remove: (position: number) => messages.value.listInput.removeItem(props.itemName, position),
  removeUnavailable: () => messages.value.listInput.removeUnavailable,
  itemName: (position: number) => messages.value.listInput.itemName(props.itemName, position),
  fieldLabel: (header: string, position: number, total: number) => messages.value.listInput.fieldLabelWithPosition(header, props.itemName, position, total),
}

function emitValue(nextValue: T[], change: ListInputChange<T>): void {
  liveValue.value = [...nextValue]
  emit('update:modelValue', nextValue)
  emit('change', nextValue, change)
}

function rowElement(itemKey: string): HTMLElement | null {
  return groupRef.value?.querySelector<HTMLElement>(`[data-list-input-row="${itemKey}"]`) ?? null
}

/**
 * `isReorderable` 的兼容写法：一个内置的可重排对象，挪动照旧通过 `v-model` 和 `change`（`type: 'reorder'`）交回去。
 */
const builtInReorderable = createReorderable<string | number>({
  onReorder: ({ key, to }) => {
    const value = liveValue.value
    const fromIndex = value.findIndex(item => itemKeyOf(item) === String(key))
    if (fromIndex < 0 || fromIndex === to || to < 0 || to >= value.length)
      return
    emitValue(moveItem(value, fromIndex, to), { type: 'reorder', item: value[fromIndex] as T, fromIndex, toIndex: to })
  },
})

const reorderable = computed<Reorderable | undefined>(() =>
  props.reorderable ?? (props.isReorderable ? builtInReorderable as Reorderable : undefined),
)

useDevWarning(
  'ListInput',
  '`isReorderable` is deprecated. Pass `reorderable` (made by `createReorderable` or `useReorderable`) instead.',
  () => props.isReorderable,
)

// 记录走 core List 的重排会话：手柄、拖动副本、落点线、边缘滚动、重排模式和播报都和 List 一样。
// 列表禁用或加载中时手柄仍可聚焦，但不再接受拖动和按键。
const reorderScope = useListReorderScope(() => reorderable.value, () => listRef.value, reorderInstructionsId)

/** 有手柄的记录拿到会话的手柄和它的名字；对象的 `isReorderable` 拒绝的记录留在原位、没有手柄。 */
function rowReorder(item: T, index: number) {
  const scope = reorderScope.value
  const key = props.getItemKey(item)
  if (scope == null || !(scope.options.isReorderable?.(key) ?? true))
    return null
  return { handle: scope.session.Handle, itemKey: key, label: labels.itemName(index + 1) }
}

const focusableFieldSelector = '[data-list-input-cell] input, [data-list-input-cell] select, [data-list-input-cell] textarea, [data-list-input-cell] button, [data-list-input-cell] [tabindex]:not([tabindex="-1"])'

/** 改完数据之后要落在哪个元素上：新加的那条的格子、下一条的删除按钮，或者 Add。 */
interface PendingFocus { itemKey?: string, target: 'first-field' | 'remove' | 'add' }
let pendingFocus: PendingFocus | null = null

watch(() => props.modelValue, () => {
  const pending = pendingFocus
  if (pending == null)
    return
  pendingFocus = null
  let target: HTMLElement | null = null
  if (pending.target === 'add') {
    target = addButtonRef.value?.element ?? null
  }
  else if (pending.itemKey != null) {
    const row = rowElement(pending.itemKey)
    const selector = pending.target === 'remove' ? '[data-list-input-remove]' : focusableFieldSelector
    target = row?.querySelector<HTMLElement>(selector) ?? null
  }
  ;(target as HTMLElement | null)?.focus()
}, { flush: 'post' })

function handleAdd(): void {
  if (mutationsDisabled.value || hasReachedMax.value)
    return
  const item = props.createItem()
  const nextValue = [...props.modelValue, item]
  pendingFocus = { itemKey: itemKeyOf(item), target: 'first-field' }
  emitValue(nextValue, { type: 'add', item, index: props.modelValue.length })
  announce(messages.value.listInput.announceAdded(props.itemName, props.modelValue.length + 1))
}

function handleUpdate(item: T, index: number, nextItem: T, columnKey?: string): void {
  if (mutationsDisabled.value)
    return
  const nextValue = [...props.modelValue]
  nextValue[index] = nextItem
  emitValue(nextValue, { type: 'update', item: nextItem, previousItem: item, index, columnKey })
}

function handleRemove(item: T): void {
  if (mutationsDisabled.value)
    return
  const itemKey = itemKeyOf(item)
  const index = props.modelValue.findIndex(candidate => itemKeyOf(candidate) === itemKey)
  if (index < 0)
    return
  const nextValue = props.modelValue.filter((_, itemIndex) => itemIndex !== index)
  const nextFocusItem = nextValue[Math.min(index, nextValue.length - 1)]
  pendingFocus = nextFocusItem == null
    ? { target: 'add' }
    : { itemKey: itemKeyOf(nextFocusItem), target: 'remove' }
  emitValue(nextValue, { type: 'remove', item: props.modelValue[index] as T, index })
  announce(messages.value.listInput.announceRemoved(props.itemName, index + 1))
}

const handlers = {
  updateItem: (item: T, index: number, nextItem: T, columnKey?: string) => handleUpdate(item, index, nextItem, columnKey),
  remove: (item: T) => handleRemove(item),
}

const fieldStatusFor = (item: T, index: number) => (columnKey: string) => props.getFieldStatus?.(item, columnKey, index)

const describedBy = computed(() => [descriptionId.value, statusId.value].filter(Boolean).join(' ') || undefined)

// 重复的 key 和列 key 会悄悄毁掉焦点和顺序，所以每次值变化都查一遍并说出来。
watch([() => props.modelValue, () => props.columns, () => props.getItemKey], () => {
  const itemKeys = new Set<string>()
  for (const item of props.modelValue) {
    const key = itemKeyOf(item)
    if (itemKeys.has(key)) {
      console.warn(`ListInput: getItemKey returned duplicate key "${key}". Keys must be unique and stable.`)
      break
    }
    itemKeys.add(key)
  }
  const columnKeys = new Set<string>()
  for (const column of props.columns) {
    if (columnKeys.has(column.key)) {
      console.warn(`ListInput: columns contains duplicate key "${column.key}". Column keys must be unique.`)
      break
    }
    columnKeys.add(column.key)
  }
}, { immediate: true })
</script>

<template>
  <Field
    :label="label" :description="description" :input-id="groupId" :label-id="labelId"
    :description-id="descriptionId" is-group-label :is-label-hidden="isLabelHidden"
    :is-optional="isOptional" :is-required="isRequired" :is-disabled="isDisabled"
    :status="status == null ? undefined : { ...status, messageId: statusId }"
    status-variant="detached"
  >
    <div
      :id="groupId" ref="groupRef" role="group" :aria-labelledby="labelId" :aria-describedby="describedBy"
      :aria-disabled="isDisabled || undefined" :aria-busy="isLoading || undefined"
      class="astryx-list-input" :data-reorderable="reorderScope ? 'true' : undefined"
      :data-state="isLoading ? 'loading' : isDisabled ? 'disabled' : undefined"
    >
      <ListReorderScope :reorder="reorderScope">
        <ol ref="listRef" :aria-labelledby="labelId" :aria-describedby="describedBy" class="astryx-list-input__list">
          <li v-if="modelValue.length === 0" data-list-input-motion-key="state:empty" class="astryx-list-input__empty-item">
            <EmptyState
              :title="messages.listInput.emptyTitle(itemName)"
              :description="messages.listInput.emptyDescription(itemName)" is-compact
            />
          </li>
          <ListInputRow
            v-for="(item, index) in modelValue" :key="itemKeyOf(item)"
            :item="item as unknown as Record<string, unknown>" :index="index" :total="modelValue.length"
            :columns="columns as never" :grid-template="gridTemplate" :item-key="itemKeyOf(item)"
            :is-disabled="isDisabled" :is-loading="isLoading" :reorder="rowReorder(item, index)"
            :field-status="fieldStatusFor(item, index)" :item-status="getItemStatus?.(item, index)"
            :item-status-id="getItemStatus?.(item, index)?.message ? `${groupId}-item-${index}-status` : undefined"
            :labels="labels" :handlers="handlers as never"
          />
        </ol>
      </ListReorderScope>

      <div data-list-input-motion-key="action:add" class="astryx-list-input__action-row">
        <div data-list-input-add-content="" class="astryx-list-input__action-content">
          <Button
            ref="addButtonRef" :label="messages.listInput.addItem(itemName)" variant="secondary"
            size="md" width="100%" :is-disabled="isDisabled || hasReachedMax" :is-loading="isLoading"
            @click="handleAdd"
          />
        </div>
      </div>
    </div>
  </Field>
</template>
