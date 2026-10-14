<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const value = ref<string | null>('engineering')
const options = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
]
</script>

<template>
  <Selector
    v-model="value"
    label="Department"
    :options="options"
    placeholder="Choose a department..."
    clearable
    :width="300"
  />
</template>
