<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const view = ref('board')
</script>

<template>
  <SegmentedControl v-model="view" label="View mode">
    <SegmentedControlItem value="board" label="Board">
      <template #icon>
        <Icon icon="i-carbon-column" />
      </template>
    </SegmentedControlItem>
    <SegmentedControlItem value="list" label="List">
      <template #icon>
        <Icon icon="i-carbon-list" />
      </template>
    </SegmentedControlItem>
    <SegmentedControlItem value="timeline" label="Timeline">
      <template #icon>
        <Icon icon="i-carbon-calendar" />
      </template>
    </SegmentedControlItem>
    <SegmentedControlItem value="chart" label="Chart">
      <template #icon>
        <Icon icon="i-carbon-arrows-vertical" />
      </template>
    </SegmentedControlItem>
  </SegmentedControl>
</template>
