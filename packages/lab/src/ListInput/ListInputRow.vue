<script setup lang="ts">
import type { Component } from 'vue'
import type { ListInputColumn, ListInputRenderContext } from './types.js'
import { FieldStatus, Icon, IconButton, useContainerReveal } from '@astryx-vue/core'
import ListInputCell from './ListInputCell.js'

defineOptions({ name: 'AstryxListInputRow' })

const props = defineProps<{
  item: Record<string, unknown>
  index: number
  total: number
  columns: ListInputColumn<unknown>[]
  gridTemplate: string
  itemKey: string
  isDisabled: boolean
  isLoading: boolean
  /** 这一条的重排手柄：重排会话的 `Handle`、记录的 key 和手柄的名字。不能动的记录为 null。 */
  reorder: { handle: Component, itemKey: string | number, label: string } | null
  /** 这一条记录某一格的校验状态，由外面按列 key 取。 */
  fieldStatus?: (columnKey: string) => { type: 'error' | 'warning' | 'success', message?: string } | undefined
  itemStatus?: { type: 'error' | 'warning' | 'success', message?: string }
  itemStatusId?: string
  labels: {
    remove: (position: number) => string
    removeUnavailable: () => string
    fieldLabel: (header: string, position: number, total: number) => string
  }
  handlers: {
    updateItem: (item: never, index: number, nextItem: never, columnKey?: string) => void
    remove: (item: never) => void
  }
}>()

// 删除按钮和手柄随记录的悬停或键盘焦点露出，触屏上一直可见。
const { containerProps, contentProps } = useContainerReveal()

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
    :aria-describedby="itemStatusId" :aria-invalid="itemStatus?.type === 'error' || undefined"
    :aria-posinset="index + 1" :aria-setsize="total" class="astryx-list-input__item"
  >
    <div :data-list-input-row="itemKey" class="astryx-list-input__row" v-bind="containerProps()">
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

      <!-- 只改透明度：删除按钮和手柄出现时不挤动字段。 -->
      <div class="astryx-list-input__control-cell" v-bind="contentProps({ isLayoutPreserved: true })">
        <IconButton
          :label="labels.remove(index + 1)"
          :tooltip="isDisabled || isLoading ? labels.removeUnavailable() : labels.remove(index + 1)"
          size="md" variant="ghost" :is-disabled="isDisabled || isLoading"
          data-list-input-remove=""
          @click="handlers.remove(item as never)"
        >
          <Icon icon="close" size="sm" />
        </IconButton>
        <component
          :is="reorder.handle" v-if="reorder"
          :label="reorder.label" :item-key="reorder.itemKey" :is-disabled="isDisabled || isLoading"
        />
      </div>

      <FieldStatus
        v-if="itemStatus?.message" :id="itemStatusId" :type="itemStatus.type"
        :message="itemStatus.message" variant="detached" data-list-input-item-status=""
        class="astryx-list-input__item-status"
      />
    </div>
  </li>
</template>
