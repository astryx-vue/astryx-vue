<script setup lang="ts">
import type { ItemDensity, ListItemProps, ListItemSlots } from './types.js'
import { computed, h, onBeforeUnmount, provide, useAttrs, useSlots, useTemplateRef } from 'vue'
import { useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import { itemListRowKey, useListContext } from './context.js'
import Item from './Item.vue'
import { itemLabelNeededKey, itemTrailingKey } from './itemSlots.js'
import { isReportedRow, keepPresentation } from './listPresentation.js'
import { itemKeyAttrs } from './listRowMarks.js'
import '../../styles/list.css'

defineOptions({ name: 'AstryxListItem' })

const props = defineProps<ListItemProps>()

defineSlots<ListItemSlots>()

const list = useListContext()

// 粗指针下，可点的行朝 44px 长出一圈看不见的热区，行自己的大小不变。
const item = useTemplateRef<{ element: HTMLElement | null }>('item')
const isTouchTarget = computed(() =>
  (props.onClick != null || props.href != null || props.interactiveRef != null) && props.isDisabled !== true,
)
useTouchHitArea(() => item.value?.element, isTouchTarget)

// 列表的 `animatedLayout` 报告过这一行时，行离开文档前记下它此刻的样子（比如横滑停住的位置），
// 移除的行退场时就显示离开那一刻屏幕上的样子。
onBeforeUnmount(() => {
  const row = item.value?.element
  if (row != null && isReportedRow(row))
    keepPresentation(row)
})

const density = computed<ItemDensity>(() => props.density ?? list?.density.value ?? 'balanced')
const marker = computed(() => {
  const listStyle = list?.listStyle.value ?? 'none'

  return listStyle === 'none' ? null : listStyle
})
provide(itemListRowKey, { isNumbered: computed(() => marker.value === 'decimal') })
const isBullet = computed(() => marker.value === 'disc' || marker.value === 'circle')

// 可重排的列表里，带 itemKey 且允许移动的行在末尾有一个重排手柄。行有 endContent 时手柄跟在它后面；
// 没有时手柄是行自己的最后一个子元素（itemTrailingKey），免得为它多出一个 end 槽位。
// 不能动的行没有手柄，只给播报留一个名字。
const attrs = useAttrs()
const slots = useSlots()
const reorder = computed(() => list?.reorder.value ?? null)
const hasHandle = computed(() => {
  const key = props.itemKey
  return reorder.value != null && key != null && (reorder.value.options.isReorderable?.(key) ?? true)
})
const isHandleInRow = computed(() => hasHandle.value && slots.endContent == null)
function renderHandle(): ReturnType<typeof h> | null {
  const session = reorder.value?.session
  if (session == null || !hasHandle.value || props.itemKey == null)
    return null
  return h(session.Handle, {
    label: props.label == null ? undefined : String(props.label),
    itemKey: props.itemKey,
    isDisabled: props.isDisabled,
    rowLabel: attrs['aria-label'] as string | undefined,
    rowLabelledBy: attrs['aria-labelledby'] as string | undefined,
    rowAlign: isHandleInRow.value ? (props.align ?? 'center') : undefined,
  })
}
provide(itemLabelNeededKey, hasHandle)
provide(itemTrailingKey, computed(() => {
  const session = reorder.value?.session
  if (session == null)
    return null
  if (hasHandle.value)
    return isHandleInRow.value ? renderHandle : null
  return () => h(session.RowName, { row: () => item.value?.element ?? null, label: props.label == null ? '' : String(props.label) })
}))
</script>

<template>
  <Item
    ref="item"
    as="li"
    class="astryx-list-item"
    :class="{ 'astryx-touch-hit-area-band': isTouchTarget }"
    :align="align"
    :description="description"
    :density="density"
    :href="href"
    :interactive-ref="interactiveRef"
    :is-disabled="isDisabled"
    :is-selected="isSelected"
    :label="label"
    :on-click="onClick"
    :swipe-actions="swipeActions"
    :swipe-behavior="swipeBehavior"
    :rel="rel"
    :target="target"
    v-bind="itemKeyAttrs(itemKey)"
  >
    <template v-if="marker" #marker>
      <span v-if="isBullet" class="astryx-list-marker">
        <span class="astryx-list-marker__glyph" :data-shape="marker" />
      </span>
      <span v-else class="astryx-list-marker__number" :data-style="marker" />
    </template>
    <template v-if="$slots.startContent" #startContent>
      <slot name="startContent" />
    </template>
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="$slots.endContent" #endContent>
      <slot name="endContent" />
      <component :is="renderHandle" v-if="hasHandle" />
    </template>
  </Item>
</template>
