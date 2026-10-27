<script setup lang="ts">
import type { ListInputColumn, ListInputRenderContext } from './types.js'
import { FieldStatus, Icon, IconButton } from '@astryx-vue/core'
import { GripVerticalIcon } from '../TransferList/icons.js'
import ListInputCell from './ListInputCell.js'

defineOptions({ name: 'AstryxListInputRow' })

const props = defineProps<{
  item: Record<string, unknown>
  index: number
  total: number
  columns: ListInputColumn<unknown>[]
  gridTemplate: string
  itemKey: string
  itemName: string
  isDisabled: boolean
  isLoading: boolean
  isReorderable: boolean
  /** 任何模式下的「正在重排的那一行」，用来标出源行。 */
  isReorderSource: boolean
  isPointerSource: boolean
  isKeyboardActive: boolean
  dropPosition: 'before' | 'after' | null
  /** 这一条记录某一格的校验状态，由外面按列 key 取。 */
  fieldStatus?: (columnKey: string) => { type: 'error' | 'warning' | 'success', message?: string } | undefined
  itemStatus?: { type: 'error' | 'warning' | 'success', message?: string }
  itemStatusId?: string
  reorderInstructionsId: string
  labels: {
    remove: (position: number) => string
    removeUnavailable: () => string
    reorder: (position: number) => string
    fieldLabel: (header: string, position: number, total: number) => string
  }
  handlers: {
    updateItem: (item: never, index: number, nextItem: never, columnKey?: string) => void
    remove: (item: never) => void
    keydown: (event: KeyboardEvent, item: never, index: number) => void
    blur: (item: never) => void
    pointerdown: (event: PointerEvent, item: never, index: number) => void
    pointermove: (event: PointerEvent) => void
    pointerup: (event: PointerEvent) => void
    pointercancel: (event: PointerEvent) => void
    lostpointercapture: (event: PointerEvent) => void
  }
}>()

/** 每条记录的单元格上下文。行堆叠时列名要带上这是第几条。 */
function cellContext(column: ListInputColumn<unknown>, columnIndex: number): ListInputRenderContext<unknown> {
  const label = props.index === 0
    ? column.header
    : props.labels.fieldLabel(column.header, props.index + 1, props.total)
  return {
    item: props.item,
    index: props.index,
    label,
    isLabelHidden: true,
    status: props.fieldStatus?.(column.key),
    statusVariant: 'tooltip',
    isDisabled: props.isDisabled || props.isLoading,
    isLoading: props.isLoading,
    updateItem: (nextItem, columnKey) => props.handlers.updateItem(props.item as never, props.index, nextItem as never, columnKey ?? props.columns[columnIndex]?.key),
  }
}
</script>

<template>
  <li
    :data-list-input-motion-key="`item:${itemKey}`"
    :data-list-input-drop-target="dropPosition ?? undefined"
    :aria-describedby="itemStatusId" :aria-invalid="itemStatus?.type === 'error' || undefined"
    :aria-posinset="index + 1" :aria-setsize="total" class="astryx-list-input__item"
  >
    <div
      :data-list-input-reorder-source="isReorderSource || undefined" :data-list-input-row="itemKey"
      class="astryx-list-input__row" :class="{ 'astryx-list-input__row--dragging': isPointerSource }"
    >
      <div class="astryx-list-input__fields" :style="{ gridTemplateColumns: gridTemplate }">
        <div v-for="(column, columnIndex) in columns" :key="column.key" class="astryx-list-input__cell" :data-list-input-cell="String(columnIndex)">
          <span
            class="astryx-list-input__column-label" aria-hidden="true"
            :data-list-input-column-label="index === 0 ? 'primary' : 'responsive'"
            :data-list-input-repeated="index === 0 ? undefined : ''"
          >{{ column.header }}</span>
          <div class="astryx-list-input__cell-content">
            <ListInputCell :render="column.renderInput" :context="cellContext(column, columnIndex)" />
          </div>
        </div>
      </div>

      <div class="astryx-list-input__control-cell">
        <IconButton
          :label="labels.remove(index + 1)"
          :tooltip="isDisabled || isLoading ? labels.removeUnavailable() : labels.remove(index + 1)"
          size="md" variant="ghost" :is-disabled="isDisabled || isLoading"
          data-list-input-remove=""
          @click="handlers.remove(item as never)"
        >
          <Icon icon="close" size="sm" />
        </IconButton>
      </div>

      <div v-if="isReorderable" class="astryx-list-input__control-cell astryx-list-input__control-cell--reorder">
        <IconButton
          class="astryx-list-input__reorder-handle" :label="labels.reorder(index + 1)"
          :aria-describedby="reorderInstructionsId" :aria-pressed="isKeyboardActive || undefined"
          size="md" variant="ghost" :is-disabled="isDisabled || isLoading"
          data-list-input-reorder=""
          @keydown="handlers.keydown($event, item as never, index)"
          @blur="handlers.blur(item as never)"
          @pointerdown="handlers.pointerdown($event, item as never, index)"
          @pointermove="handlers.pointermove($event)"
          @pointerup="handlers.pointerup($event)"
          @pointercancel="handlers.pointercancel($event)"
          @lostpointercapture="handlers.lostpointercapture($event)"
        >
          <Icon :icon="GripVerticalIcon" size="sm" />
        </IconButton>
      </div>

      <FieldStatus
        v-if="itemStatus?.message" :id="itemStatusId" :type="itemStatus.type"
        :message="itemStatus.message" variant="detached" data-list-input-item-status=""
        class="astryx-list-input__item-status"
      />
    </div>
  </li>
</template>
