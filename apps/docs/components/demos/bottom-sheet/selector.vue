<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const value = ref<string | null>(null)
const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
]
</script>

<template>
  <div class="bottom-sheet-field">
    <Selector
      v-model="value"
      label="Team"
      :options="options"
      placeholder="Choose a team"
      presentation="bottom-sheet"
    />
  </div>
</template>

<style scoped>
.bottom-sheet-field {
  width: 320px;
  max-width: 100%;
}
</style>
