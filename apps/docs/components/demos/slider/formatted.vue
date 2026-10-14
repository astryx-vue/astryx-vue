<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { ref } from 'vue'

const value = ref(72)

function formatValue(next: number): string {
  return `${next}°F`
}
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <Slider
      v-model="value"
      label="Temperature"
      value-display="text"
      :min="60"
      :max="90"
      :step="1"
      :format-value="formatValue"
    />
  </div>
</template>
