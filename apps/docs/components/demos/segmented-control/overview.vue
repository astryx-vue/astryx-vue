<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const view = ref('overview')
</script>

<template>
  <SegmentedControl v-model="view" label="Workspace view">
    <SegmentedControlItem label="Overview" value="overview" />
    <SegmentedControlItem label="Activity" value="activity" />
    <SegmentedControlItem label="Members" value="members" />
  </SegmentedControl>
</template>
