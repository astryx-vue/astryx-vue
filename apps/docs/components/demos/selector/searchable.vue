<script setup lang="ts">
import { ref } from 'vue'
import { Selector } from '@astryx-vue/core/Selector'

const selected = ref<string | null>(null)
const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
  { value: 'grape', label: '葡萄' },
  { value: 'orange', label: '橙子' },
  { value: 'mango', label: '芒果' },
  { value: 'watermelon', label: '西瓜' },
  { value: 'strawberry', label: '草莓' },
]
</script>

<template>
  <div class="demo-container">
    <Selector
      v-model="selected"
      :options="options"
      searchable
      placeholder="搜索水果"
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
