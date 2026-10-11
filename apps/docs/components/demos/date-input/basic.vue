<script setup lang="ts">
import { ref } from 'vue'
import { DateInput } from '@astryx-vue/core/DateInput'

const date = ref<Date | null>(null)
</script>

<template>
  <div class="demo-container">
    <DateInput v-model="date" label="出发日期" placeholder="选择日期" />
    <p class="demo-result">
      选中的日期：{{ date ? date.toLocaleDateString('zh-CN') : '未选择' }}
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
