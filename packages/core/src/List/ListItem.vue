<script setup lang="ts">
import type { ItemDensity, ListItemProps, ListItemSlots } from './types.js'
import { computed, provide, useTemplateRef } from 'vue'
import { useTouchHitArea } from '../composables/internal/useTouchHitArea.js'
import { itemListRowKey, useListContext } from './context.js'
import Item from './Item.vue'
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

const density = computed<ItemDensity>(() => props.density ?? list?.density.value ?? 'balanced')
const marker = computed(() => {
  const listStyle = list?.listStyle.value ?? 'none'

  return listStyle === 'none' ? null : listStyle
})
provide(itemListRowKey, { isNumbered: computed(() => marker.value === 'decimal') })
const isBullet = computed(() => marker.value === 'disc' || marker.value === 'circle')
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
    </template>
  </Item>
</template>
