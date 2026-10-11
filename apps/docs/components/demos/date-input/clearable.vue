<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const date = ref<Date | null>(new Date(2026, 9, 11))
const { pick } = useDemoText()

function formatSelected(value: Date): string {
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${value.getFullYear()}-${month}-${day}`
}
</script>

<template>
  <div class="demo-container">
    <DateInput v-model="date" :label="pick('截止日期', 'Due date')" clearable />
    <p class="demo-result">
      {{ pick('选中的日期：', 'Selected: ') }}{{ date ? formatSelected(date) : pick('未选择', 'none') }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(100%, 20rem);
}
.demo-result {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
