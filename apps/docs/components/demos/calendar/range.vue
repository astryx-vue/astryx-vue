<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@astryx-vue/core/Calendar'
import { today, type CalendarDate } from '@internationalized/date'

const selected = ref<CalendarDate | null>(null)
const minDate = today('Asia/Shanghai')
const maxDate = today('Asia/Shanghai').add({ months: 1 })
</script>

<template>
  <div class="demo-container">
    <Calendar v-model="selected" :min-value="minDate" :max-value="maxDate" />
    <p class="demo-result">
      可选范围：未来一个月内
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
