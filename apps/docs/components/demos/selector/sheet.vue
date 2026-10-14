<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const value = ref<string | undefined>()
const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
]
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <Selector
      v-model="value"
      label="Team"
      :options="options"
      placeholder="Choose a team"
      presentation="bottom-sheet"
    />
  </div>
</template>
