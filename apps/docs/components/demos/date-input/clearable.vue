<script setup lang="ts">
import { ref } from 'vue'
import { DateInput } from '@astryx-vue/core/DateInput'
import { today, type CalendarDate } from '@internationalized/date'

const date = ref<CalendarDate>(today('Asia/Shanghai'))
</script>

<template>
  <div class="demo-container">
    <DateInput v-model="date" clearable />
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
