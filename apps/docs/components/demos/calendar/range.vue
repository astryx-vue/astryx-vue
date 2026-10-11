<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@astryx-vue/core/Calendar'

const selected = ref<Date | null>(null)
const minDate = new Date(2026, 9, 11)
const maxDate = new Date(2026, 10, 11)
</script>

<template>
  <div class="demo-container">
    <Calendar v-model="selected" label="可选日期" :min="minDate" :max="maxDate" />
    <p class="demo-result">
      只能选择 2026-10-11 到 2026-11-11
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
.demo-result {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
