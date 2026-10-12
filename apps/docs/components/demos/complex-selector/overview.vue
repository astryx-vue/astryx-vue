<script setup lang="ts">
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { ref } from 'vue'

const value = ref('Today')
</script>

<template>
  <ComplexSelector
    v-model="value"
    description="Choose a preset or set a custom date and time."
    label="Deadline"
    trigger-label="Today"
    width="100%"
  >
    <p>Today</p>
  </ComplexSelector>
</template>
