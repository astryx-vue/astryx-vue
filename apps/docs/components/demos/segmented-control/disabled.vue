<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const value = ref('hourly')
</script>

<template>
  <SegmentedControl v-model="value" label="Data granularity">
    <SegmentedControlItem value="hourly" label="Hourly" />
    <SegmentedControlItem value="daily" label="Daily" />
    <SegmentedControlItem value="weekly" label="Weekly" is-disabled />
  </SegmentedControl>
</template>
