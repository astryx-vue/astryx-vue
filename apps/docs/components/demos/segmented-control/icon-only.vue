<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { ref } from 'vue'

const value = ref('grid')
</script>

<template>
  <SegmentedControl v-model="value" label="View mode" size="sm">
    <SegmentedControlItem value="grid" label="Grid" is-label-hidden>
      <template #icon>
        <Icon icon="i-heroicons-squares-2x2" />
      </template>
    </SegmentedControlItem>
    <SegmentedControlItem value="list" label="List" is-label-hidden>
      <template #icon>
        <Icon icon="i-heroicons-list-bullet" />
      </template>
    </SegmentedControlItem>
  </SegmentedControl>
</template>
