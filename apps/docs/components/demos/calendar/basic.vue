<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<Date | null>(new Date(2026, 9, 11))
const { pick } = useDemoText()

function formatSelected(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
</script>

<template>
  <div class="demo-container">
    <Calendar v-model="selected" :label="pick('选择日期', 'Select a date')" />
    <p class="demo-result">
      {{ pick('选中的日期：', 'Selected: ') }}{{ selected ? formatSelected(selected) : pick('未选择', 'none') }}
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
