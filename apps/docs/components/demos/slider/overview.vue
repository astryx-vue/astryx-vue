<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { shallowRef } from 'vue'

const volume = shallowRef(40)

function formatPercent(value: number): string {
  return `${value}%`
}
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <Slider v-model="volume" label="Volume" value-display="text" :format-value="formatPercent" />
  </div>
</template>
