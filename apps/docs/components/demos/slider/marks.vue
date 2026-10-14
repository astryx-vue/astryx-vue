<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { ref } from 'vue'

const value = ref(50)
const marks = [
  { value: 0, label: '0' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 100, label: '100' },
]
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <Slider v-model="value" label="Volume" :marks="marks" />
  </div>
</template>
