<script setup lang="ts">
import { ref } from 'vue'
import { DateInput } from '@astryx-vue/core/DateInput'
import type { CalendarDate } from '@internationalized/date'

const date = ref<CalendarDate | null>(null)
</script>

<template>
  <div class="demo-container">
    <DateInput v-model="date" placeholder="选择日期" />
    <p class="demo-result">
      选中的日期：{{ date?.toString() || '未选择' }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 20rem;
}
.demo-result {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
