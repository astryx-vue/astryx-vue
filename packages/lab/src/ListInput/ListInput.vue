<script setup lang="ts" generic="T">
import type { ListInputChange, ListInputEmits, ListInputProps } from './types.js'
import { Button, EmptyState, Field, useAnnounce, useTranslator, VisuallyHidden } from '@astryx-vue/core'
import { computed, ref, useId, useTemplateRef, watch } from 'vue'
import { resolveGridTemplate } from './columns.js'
import ListInputRow from './ListInputRow.vue'
import { useListReorder } from './useListReorder.js'
import '../../styles/list-input.css'

defineOptions({ name: 'AstryxListInput', inheritAttrs: false })

const props = withDefaults(defineProps<ListInputProps<T>>(), {
  modelValue: () => [],
  itemName: 'item',
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
const { t } = useTranslator()
const announce = useAnnounce()

const uid = useId()
const groupId = `list-input-${uid}`
const labelId = `${groupId}-label`
const descriptionId = computed(() => (props.description ? `${groupId}-description` : undefined))
const statusId = computed(() => (props.status?.message ? `${groupId}-status` : undefined))
const reorderInstructionsId = `${groupId}-reorder-instructions`

const groupRef = useTemplateRef<HTMLDivElement>('groupRef')
const addButtonRef = useTemplateRef<{ element: HTMLElement | null }>('addButtonRef')
const previewHost = ref<HTMLElement | null>(null)

const itemKeyOf = (item: T): string => String(props.getItemKey(item))
const mutationsDisabled = computed(() => props.isDisabled || props.isLoading)
const hasReachedMax = computed(() => props.maxItems != null && props.modelValue.length >= props.maxItems)
const gridTemplate = computed(() => resolveGridTemplate(props.columns))

/** 提交之后 props 才会回来，中间的连点读不到最新值，这里留一份同步的顺序。 */
const liveValue = ref<T[]>([...props.modelValue]) as { value: T[] }
watch(() => props.modelValue, (next) => {
  liveValue.value = [...next]
})

const announceMessages = {
  grabbed: (position: number) => t('@astryx.listInput.announceGrabbed', { itemName: props.itemName, position }),
  movedToPosition: (position: number, total: number) => t('@astryx.listInput.announceMovedToPosition', { itemName: props.itemName, position, total }),
  reorderCancelled: () => t('@astryx.listInput.announceReorderCancelled'),
  returnedToPosition: (position: number) => t('@astryx.listInput.announceReturnedToPosition', { itemName: props.itemName, position }),
  dropped: (position: number, total: number) => t('@astryx.listInput.announceDropped', { itemName: props.itemName, position, total }),
  alreadyAtBoundary: (boundary: 'first' | 'last') => t('@astryx.listInput.announceAlreadyAtBoundary', { itemName: props.itemName, boundary }),
}

const labels = {
  remove: (position: number) => t('@astryx.listInput.removeItem', { itemName: props.itemName, position }),
  removeUnavailable: () => t('@astryx.listInput.removeUnavailable', { itemName: props.itemName }),
  reorder: (position: number) => t('@astryx.listInput.reorderItem', { itemName: props.itemName, position }),
  fieldLabel: (header: string, position: number, total: number) => t('@astryx.listInput.fieldLabelWithPosition', { header, itemName: props.itemName, position, total }),
}

function emitValue(nextValue: T[], change: ListInputChange<T>): void {
  liveValue.value = [...nextValue]
  emit('update:modelValue', nextValue)
  emit('change', nextValue, change)
}

function rowElement(itemKey: string): HTMLElement | null {
  return groupRef.value?.querySelector<HTMLElement>(`[data-list-input-row="${itemKey}"]`) ?? null
}

const reorder = useListReorder<T>({
  currentValue: () => liveValue.value,
  getItemKey: item => props.getItemKey(item),
  isReorderable: () => props.isReorderable,
  isBlocked: () => mutationsDisabled.value,
  rowElement,
  previewHost,
  emitReorder: (nextValue, change) => emitValue(nextValue, change),
  announce,
  messages: announceMessages,
})

// 列表变成禁用或加载中时，进行中的重排立刻放弃，不让顺序改动漏出去。
watch(mutationsDisabled, (blocked) => {
  if (blocked && reorder.state.value != null) {
    reorder.state.value = null
    announce(announceMessages.reorderCancelled())
  }
})

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
  announce(t('@astryx.listInput.announceAdded', { itemName: props.itemName, position: props.modelValue.length + 1 }))
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
  announce(t('@astryx.listInput.announceRemoved', { itemName: props.itemName, position: index + 1 }))
}

const handlers = {
  updateItem: (item: T, index: number, nextItem: T, columnKey?: string) => handleUpdate(item, index, nextItem, columnKey),
  remove: (item: T) => handleRemove(item),
  keydown: (event: KeyboardEvent, item: T, index: number) => reorder.onHandleKeydown(event, item, index),
  blur: (item: T) => reorder.onHandleBlur(item),
  pointerdown: (event: PointerEvent, item: T, index: number) => reorder.onHandlePointerDown(event, item, index),
  pointermove: (event: PointerEvent) => reorder.onHandlePointerMove(event),
  pointerup: (event: PointerEvent) => reorder.onHandlePointerUp(event),
  pointercancel: (event: PointerEvent) => reorder.onHandlePointerCancel(event),
  lostpointercapture: (event: PointerEvent) => reorder.onHandleLostPointerCapture(event),
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
      class="astryx-list-input" :data-reorderable="isReorderable ? 'true' : undefined"
      :data-state="isLoading ? 'loading' : isDisabled ? 'disabled' : undefined"
    >
      <ol :aria-labelledby="labelId" :aria-describedby="describedBy" class="astryx-list-input__list">
        <li v-if="reorder.displayValue.value.length === 0" data-list-input-motion-key="state:empty" class="astryx-list-input__empty-item">
          <EmptyState
            :title="t('@astryx.listInput.emptyTitle', { itemName })"
            :description="t('@astryx.listInput.emptyDescription', { itemName })" is-compact
          />
        </li>
        <ListInputRow
          v-for="(item, index) in reorder.displayValue.value" :key="itemKeyOf(item)"
          :item="item as unknown as Record<string, unknown>" :index="index" :total="reorder.displayValue.value.length"
          :columns="columns as never" :grid-template="gridTemplate" :item-key="itemKeyOf(item)"
          :item-name="itemName" :is-disabled="isDisabled" :is-loading="isLoading" :is-reorderable="isReorderable"
          :is-reorder-source="reorder.state.value?.itemKey === itemKeyOf(item)"
          :is-pointer-source="reorder.sourceKey.value === itemKeyOf(item)"
          :is-keyboard-active="reorder.keyboardKey.value === itemKeyOf(item)"
          :drop-position="reorder.pointerDrop.value?.itemKey === itemKeyOf(item) ? reorder.pointerDrop.value.position : null"
          :field-status="fieldStatusFor(item, index)" :item-status="getItemStatus?.(item, index)"
          :item-status-id="getItemStatus?.(item, index)?.message ? `${groupId}-item-${index}-status` : undefined"
          :reorder-instructions-id="reorderInstructionsId" :labels="labels" :handlers="handlers as never"
        />
      </ol>

      <div data-list-input-motion-key="action:add" class="astryx-list-input__action-row">
        <div data-list-input-add-content="" class="astryx-list-input__action-content">
          <Button
            ref="addButtonRef" :label="t('@astryx.listInput.addItem', { itemName })" variant="secondary"
            size="md" width="100%" :is-disabled="isDisabled || hasReachedMax" :is-loading="isLoading"
            @click="handleAdd"
          />
        </div>
      </div>

      <VisuallyHidden v-if="isReorderable" :id="reorderInstructionsId" as="div">
        {{ t('@astryx.listInput.reorderInstructions') }}
      </VisuallyHidden>
    </div>

    <Teleport to="body">
      <div
        v-if="reorder.previewStyle.value != null" ref="previewHost"
        class="astryx-list-input__drag-preview" data-list-input-drag-preview
        aria-hidden="true" :style="reorder.previewStyle.value"
      />
    </Teleport>
  </Field>
</template>
