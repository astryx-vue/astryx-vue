<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const value = ref('grid')
</script>

<template>
  <SegmentedControl v-model="value" label="View mode">
    <SegmentedControlItem value="grid" label="Grid">
      <template #icon>
        <Icon icon="i-heroicons-squares-2x2" />
      </template>
    </SegmentedControlItem>
    <SegmentedControlItem value="list" label="List">
      <template #icon>
        <Icon icon="i-heroicons-list-bullet" />
      </template>
    </SegmentedControlItem>
    <SegmentedControlItem value="table" label="Table">
      <template #icon>
        <Icon icon="i-heroicons-table-cells" />
      </template>
    </SegmentedControlItem>
  </SegmentedControl>
</template>
