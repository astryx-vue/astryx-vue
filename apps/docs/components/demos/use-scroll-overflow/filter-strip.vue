<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useScrollOverflow } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { Token } from '@astryx-vue/core/Token'
import { computed, ref } from 'vue'

const FILTERS = [
  'Open now',
  'Free delivery',
  'Vegetarian',
  'Under $15',
  'Top rated',
  'Outdoor seating',
  'Pet friendly',
]

const filters = ref(FILTERS.slice(0, 2))
const isRtl = ref(false)
const { scrollRef, overflowStart, overflowEnd } = useScrollOverflow()

const nextFilter = computed(() => FILTERS.find(filter => !filters.value.includes(filter)))

// 只淡出藏着筛选项的那一边；mask 按物理方向画，RTL 下起始边在右边。
const fade = computed(() => {
  if (overflowStart.value && overflowEnd.value)
    return 'both'
  if (overflowStart.value)
    return isRtl.value ? 'right' : 'left'
  if (overflowEnd.value)
    return isRtl.value ? 'left' : 'right'
  return undefined
})

function bindStrip(el: Element | ComponentPublicInstance | null): void {
  scrollRef(el instanceof HTMLElement ? el : null)
}

function addFilter(): void {
  if (nextFilter.value != null)
    filters.value = [...filters.value, nextFilter.value]
}

function removeFilter(filter: string): void {
  filters.value = filters.value.filter(item => item !== filter)
}
</script>

<template>
  <VStack :gap="3" :width="320">
    <div :dir="isRtl ? 'rtl' : 'ltr'">
      <div
        :ref="bindStrip"
        class="filter-strip"
        :data-fade="fade"
        role="group"
        aria-label="Active filters"
      >
        <Token
          v-for="filter in filters"
          :key="filter"
          class="filter-strip__filter"
          :label="filter"
          removable
          @remove="removeFilter(filter)"
        />
      </div>
    </div>
    <HStack align="center" :gap="3">
      <Button label="Add filter" variant="secondary" :is-disabled="nextFilter == null" @click="addFilter" />
      <Switch v-model="isRtl" label="Right to left" />
    </HStack>
  </VStack>
</template>

<style scoped>
.filter-strip {
  --fade: var(--astryx-spacing-8, 32px);
  display: flex;
  gap: var(--astryx-spacing-2, 8px);
  overflow-x: auto;
}

.filter-strip__filter {
  flex-shrink: 0;
}

.filter-strip[data-fade='left'] {
  mask-image: linear-gradient(to right, transparent, black var(--fade));
}

.filter-strip[data-fade='right'] {
  mask-image: linear-gradient(to left, transparent, black var(--fade));
}

.filter-strip[data-fade='both'] {
  mask-image: linear-gradient(to right, transparent, black var(--fade), black calc(100% - var(--fade)), transparent);
}
</style>
