<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const value = ref('weekly')
</script>

<template>
  <div style="width: 400px">
    <SegmentedControl v-model="value" label="Time range" layout="fill">
      <SegmentedControlItem value="daily" label="Daily" />
      <SegmentedControlItem value="weekly" label="Weekly" />
      <SegmentedControlItem value="monthly" label="Monthly" />
    </SegmentedControl>
  </div>
</template>
