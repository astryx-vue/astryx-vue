<script setup lang="ts">
import { ref } from 'vue'
import { Selector } from '@astryx-vue/core/Selector'

const selected = ref<string | null>('banana')
const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
]
</script>

<template>
  <div class="demo-container">
    <Selector
      v-model="selected"
      :options="options"
      clearable
      placeholder="选择水果"
    />
    <p class="demo-result">
      选中的值：{{ selected || '未选择' }}
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
