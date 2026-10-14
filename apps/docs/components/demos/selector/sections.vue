<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const value = ref<string | undefined>()
const options = [
  {
    type: 'section' as const,
    title: 'North America',
    options: [
      { value: 'nyc', label: 'New York' },
      { value: 'sf', label: 'San Francisco' },
      { value: 'sea', label: 'Seattle' },
    ],
  },
  {
    type: 'section' as const,
    title: 'Europe',
    options: [
      { value: 'ldn', label: 'London' },
      { value: 'ber', label: 'Berlin' },
    ],
  },
  {
    type: 'section' as const,
    title: 'Asia Pacific',
    options: [
      { value: 'tyo', label: 'Tokyo' },
      { value: 'sgp', label: 'Singapore' },
    ],
  },
]
</script>

<template>
  <Selector
    v-model="value"
    label="Office"
    :options="options"
    placeholder="Choose an office..."
    :width="300"
  />
</template>
