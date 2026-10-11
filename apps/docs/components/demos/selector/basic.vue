<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'
import { useDemoText, useLocalizedOptions } from '../../demo-infra/useDemoText'

const selected = ref<string | null>(null)
const { pick } = useDemoText()
const options = useLocalizedOptions([
  { value: 'apple', zh: '苹果', en: 'Apple' },
  { value: 'banana', zh: '香蕉', en: 'Banana' },
  { value: 'cherry', zh: '樱桃', en: 'Cherry' },
  { value: 'grape', zh: '葡萄', en: 'Grape' },
  { value: 'orange', zh: '橙子', en: 'Orange' },
])
</script>

<template>
  <div class="demo-container">
    <Selector v-model="selected" :options="options" :placeholder="pick('选择水果', 'Select a fruit')" />
    <p class="demo-result">
      {{ pick('选中的值：', 'Selected: ') }}{{ selected || pick('未选择', 'none') }}
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
