<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const value = ref('grid')
</script>

<template>
  <SegmentedControl v-model="value" label="View mode">
    <SegmentedControlItem value="grid" label="Grid" />
    <SegmentedControlItem value="list" label="List" />
    <SegmentedControlItem value="table" label="Table" />
  </SegmentedControl>
</template>
