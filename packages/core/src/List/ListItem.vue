<script setup lang="ts">
import type { ItemDensity, ListItemProps, ListItemSlots } from './types.js'
import { computed } from 'vue'
import { useListContext } from './context.js'
import Item from './Item.vue'
import '../../styles/list.css'

defineOptions({ name: 'AstryxListItem' })

const props = defineProps<ListItemProps>()

defineSlots<ListItemSlots>()

const list = useListContext()

const density = computed<ItemDensity>(() => props.density ?? list?.density.value ?? 'balanced')
const marker = computed(() => {
  const listStyle = list?.listStyle.value ?? 'none'

  return listStyle === 'none' ? null : listStyle
})
const isBullet = computed(() => marker.value === 'disc' || marker.value === 'circle')
</script>

<template>
  <Item
    as="li"
    class="astryx-list-item"
    :description="description"
    :density="density"
    :href="href"
    :interactive-ref="interactiveRef"
    :is-disabled="isDisabled"
    :is-selected="isSelected"
    :label="label"
    :on-click="onClick"
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
