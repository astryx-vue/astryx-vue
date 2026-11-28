<script setup lang="ts" generic="T extends string">
import type { Reorderable } from '@astryx-vue/core'
import type { PanelGroup, PanelRow, TransferListOption } from './types.js'
import { Icon, IconButton, Item, List, ListItem, Text, VisuallyHidden } from '@astryx-vue/core'
import { computed } from 'vue'
import DisabledHandleTooltip from './DisabledHandleTooltip.vue'
import { PlusIcon } from './icons.js'

defineOptions({ name: 'AstryxTransferListPanel' })

const props = defineProps<{
  side: 'selected' | 'available'
  headingId: string
  label: string
  showAction: boolean
  actionLabel: string
  isActionDisabled: boolean
  groups: PanelGroup<T>[]
  showGroupHeadings: boolean
  ungroupedLabel: string
  emptyText: string
  /** 已选栏交给 core List 的重排对象。搜索中或不能重排时为 undefined。 */
  reorderable?: Reorderable
  /** 这一栏正在按顺序排：可挪的行尾有重排手柄。 */
  isOrdering: boolean
  canMove: (value: T) => boolean
  isDisabled: boolean
  findRow: (value: T) => HTMLElement | null
  labels: {
    addOption: (label: string) => string
    removeOption: (label: string) => string
    transferDisabled: (label: string) => string
    reorderDisabled: (label: string) => string
  }
}>()

const emit = defineEmits<{
  action: []
  add: [option: TransferListOption<T>, index: number]
  remove: [option: TransferListOption<T>, index: number]
}>()

/** 分组壳子在、但一行都没有时也要走空状态。 */
const hasRows = computed(() => props.groups.some(group => group.options.length > 0))

/** 在已选栏里，这一行是可挪的（`movable`）还是留在原位（`fixed`）。 */
function reorderState(option: TransferListOption<T>): 'movable' | 'fixed' | undefined {
  if (props.side !== 'selected' || !props.isOrdering)
    return undefined
  return props.canMove(option.value) ? 'movable' : 'fixed'
}

/** 已选栏的行是 core 的 ListItem（值当 itemKey，行尾带重排手柄），可选栏的行是普通 Item。 */
function rowProps(row: PanelRow<T>): Record<string, unknown> {
  const state = row.option.isTransferDisabled ? 'disabled' : 'enabled'
  if (props.side === 'available')
    return { 'as': 'li', 'data-state': state }
  return {
    'itemKey': row.option.value,
    'label': row.option.label,
    // 禁用的列表里每一行都是禁用的 ListItem：手柄留在 Tab 顺序里但不接受拖动，正在进行的重排会收尾。
    'isDisabled': props.isDisabled,
    'data-transfer-list-row': row.option.value,
    'data-transfer-list-index': String(row.index),
    'data-state': state,
    'data-reorder': reorderState(row.option),
  }
}
</script>

<template>
  <div
    class="astryx-transfer-list-panel" :data-side="side" role="group"
    :aria-labelledby="headingId" tabindex="-1"
  >
    <div class="astryx-transfer-list-panel__header">
      <Text :id="headingId" type="label" color="secondary">
        {{ label }}
      </Text>
      <button
        v-if="showAction" type="button" class="astryx-transfer-list-header-action"
        data-transfer-list-header-action="true" :aria-disabled="isActionDisabled ? 'true' : undefined"
        @click="!isActionDisabled && emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>

    <div class="astryx-transfer-list-panel__body" :data-transfer-list-panel-body="side">
      <List v-if="hasRows" density="compact" :reorderable="side === 'selected' ? reorderable : undefined">
        <template #header>
          <VisuallyHidden>{{ label }}</VisuallyHidden>
        </template>
        <template v-for="group in groups" :key="group.group || 'ungrouped'">
          <li
            v-if="showGroupHeadings && (group.group !== '' || groups.length > 1)"
            role="presentation" class="astryx-transfer-list-panel__group-heading"
          >
            <Text type="body" weight="bold" color="primary">
              {{ group.group || ungroupedLabel }}
            </Text>
          </li>
          <component
            :is="side === 'selected' ? ListItem : Item"
            v-for="row in group.options" :key="row.option.value" density="compact"
            class="astryx-transfer-list-item" :data-side="side" v-bind="rowProps(row)"
          >
            <template #label>
              <slot name="option" :option="row.option">
                {{ row.option.label }}
              </slot>
            </template>

            <template #endContent>
              <IconButton
                v-if="side === 'available'" class="astryx-transfer-list-row-action"
                :label="labels.addOption(row.option.label)" size="sm" variant="ghost"
                :is-disabled="row.option.isTransferDisabled === true"
                :tooltip="row.option.isTransferDisabled === true ? (row.option.disabledMessage ?? labels.transferDisabled(row.option.label)) : undefined"
                data-transfer-list-action="available"
                @click="emit('add', row.option, row.index)"
              >
                <Icon :icon="PlusIcon" size="sm" />
              </IconButton>
              <template v-else>
                <!-- 留在原位的行没有手柄：删除按钮让出手柄的位置，和可挪的行对齐成一列。 -->
                <IconButton
                  class="astryx-transfer-list-row-action"
                  :class="{ 'astryx-transfer-list-row-action--clears-handle': reorderState(row.option) === 'fixed' }"
                  :label="labels.removeOption(row.option.label)" size="sm" variant="ghost"
                  :is-disabled="row.option.isTransferDisabled === true"
                  :tooltip="row.option.isTransferDisabled === true ? (row.option.disabledMessage ?? labels.transferDisabled(row.option.label)) : undefined"
                  data-transfer-list-action="selected"
                  @click="emit('remove', row.option, row.index)"
                >
                  <Icon icon="close" size="sm" />
                </IconButton>
                <DisabledHandleTooltip
                  v-if="isDisabled && reorderState(row.option) === 'movable'"
                  :find-row="() => findRow(row.option.value)"
                  :content="labels.reorderDisabled(row.option.label)"
                />
              </template>
            </template>
          </component>
        </template>
      </List>
      <div v-else class="astryx-transfer-list-panel__empty" :data-transfer-list-empty="side">
        <Text type="supporting" color="secondary">
          {{ emptyText }}
        </Text>
      </div>
    </div>
  </div>
</template>
