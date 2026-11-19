<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
import { Icon } from '@astryx-vue/core/Icon'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const view = ref('board')
</script>

<template>
  <Center>
    <SegmentedControl v-model="view" label="View mode">
      <SegmentedControlItem value="board" label="Board">
        <template #icon>
          <Icon icon="viewColumns" />
        </template>
      </SegmentedControlItem>
      <SegmentedControlItem value="list" label="List">
        <template #icon>
          <Icon icon="menu" />
        </template>
      </SegmentedControlItem>
      <SegmentedControlItem value="timeline" label="Timeline">
        <template #icon>
          <Icon icon="calendar" />
        </template>
      </SegmentedControlItem>
      <SegmentedControlItem value="chart" label="Chart" is-disabled>
        <template #icon>
          <Icon icon="arrowsUpDown" />
        </template>
      </SegmentedControlItem>
    </SegmentedControl>
  </Center>
</template>
