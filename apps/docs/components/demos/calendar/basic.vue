<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@astryx-vue/core/Calendar'

const selected = ref<Date | null>(new Date(2026, 9, 11))
</script>

<template>
  <div class="demo-container">
    <Calendar v-model="selected" label="选择日期" />
    <p class="demo-result">
      选中的日期：{{ selected ? selected.toLocaleDateString('zh-CN') : '未选择' }}
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
