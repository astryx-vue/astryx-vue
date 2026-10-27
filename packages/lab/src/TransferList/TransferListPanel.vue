<script setup lang="ts" generic="T extends string">
import type { PanelGroup, TransferListOption } from './types.js'
import { Icon, IconButton, Item, List, Text, VisuallyHidden } from '@astryx-vue/core'
import { computed } from 'vue'
import { GripVerticalIcon, PlusIcon } from './icons.js'

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
  isReorderable: boolean
  draggingValue: T | null
  grabbedValue: T | null
  dropTarget: { value: T, position: 'before' | 'after' } | null
  reorderInstructionsId: string
  labels: {
    addOption: (label: string) => string
    removeOption: (label: string) => string
    reorderOption: (label: string) => string
    transferDisabled: (label: string) => string
    reorderDisabled: (label: string) => string
  }
  handlers: {
    click: (option: TransferListOption<T>) => void
    keydown: (event: KeyboardEvent, option: TransferListOption<T>) => void
    pointerdown: (event: PointerEvent, option: TransferListOption<T>) => void
    pointermove: (event: PointerEvent, option: TransferListOption<T>) => void
    pointerup: (event: PointerEvent, option: TransferListOption<T>) => void
    pointercancel: (event: PointerEvent, option: TransferListOption<T>) => void
    lostpointercapture: (event: PointerEvent) => void
  }
}>()

const emit = defineEmits<{
  action: []
  add: [option: TransferListOption<T>, index: number]
  remove: [option: TransferListOption<T>, index: number]
}>()

/** 分组壳子在、但一行都没有时也要走空状态。 */
const hasRows = computed(() => props.groups.some(group => group.options.length > 0))

function dropPositionOf(option: TransferListOption<T>): 'before' | 'after' | undefined {
  return props.dropTarget?.value === option.value ? props.dropTarget.position : undefined
}

function rowState(option: TransferListOption<T>): 'disabled' | 'reordering' | 'enabled' {
  if (option.isTransferDisabled || option.isReorderDisabled)
    return 'disabled'
  if (props.draggingValue === option.value || props.grabbedValue === option.value)
    return 'reordering'
  return 'enabled'
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
        data-transfer-list-header-action="true" :disabled="isActionDisabled"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>

    <div class="astryx-transfer-list-panel__body" :data-transfer-list-panel-body="side">
      <List v-if="hasRows" density="compact">
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
          <Item
            v-for="row in group.options" :key="row.option.value" as="li" density="compact"
            class="astryx-transfer-list-item"
            :data-transfer-list-row="side === 'selected' ? row.option.value : undefined"
            :data-transfer-list-reorder-source="draggingValue === row.option.value || undefined"
            :data-transfer-list-drop-target="dropPositionOf(row.option)"
            :data-transfer-list-index="side === 'selected' ? String(row.index) : undefined"
            :data-side="side" :data-state="rowState(row.option)"
          >
            <template v-if="side === 'selected'" #startContent>
              <IconButton
                v-if="isReorderable"
                class="astryx-transfer-list-reorder-handle"
                :label="labels.reorderOption(row.option.label)"
                :aria-describedby="reorderInstructionsId"
                :aria-pressed="grabbedValue === row.option.value || undefined"
                :is-disabled="row.option.isReorderDisabled === true"
                :tooltip="row.option.isReorderDisabled === true ? (row.option.disabledMessage ?? labels.reorderDisabled(row.option.label)) : undefined"
                size="sm" variant="ghost"
                @click="handlers.click(row.option)"
                @keydown="handlers.keydown($event, row.option)"
                @pointerdown="handlers.pointerdown($event, row.option)"
                @pointermove="handlers.pointermove($event, row.option)"
                @pointerup="handlers.pointerup($event, row.option)"
                @pointercancel="handlers.pointercancel($event, row.option)"
                @lostpointercapture="handlers.lostpointercapture($event)"
              >
                <Icon :icon="GripVerticalIcon" size="sm" />
              </IconButton>
            </template>

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
              <IconButton
                v-else class="astryx-transfer-list-row-action"
                :label="labels.removeOption(row.option.label)" size="sm" variant="ghost"
                :is-disabled="row.option.isTransferDisabled === true"
                :tooltip="row.option.isTransferDisabled === true ? (row.option.disabledMessage ?? labels.transferDisabled(row.option.label)) : undefined"
                data-transfer-list-action="selected"
                @click="emit('remove', row.option, row.index)"
              >
                <Icon icon="close" size="sm" />
              </IconButton>
            </template>
          </Item>
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
