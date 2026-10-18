<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const view = ref('board')
</script>

<template>
  <SegmentedControl v-model="view" label="View mode">
    <SegmentedControlItem value="board" label="Board" />
    <SegmentedControlItem value="list" label="List" />
    <SegmentedControlItem value="timeline" label="Timeline" />
  </SegmentedControl>
</template>
