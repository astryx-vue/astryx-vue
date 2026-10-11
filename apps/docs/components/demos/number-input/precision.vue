<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const price = ref(9.5)
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-container">
    <NumberInput v-model="price" :label="pick('价格', 'Price')" :min="0" :max="20" :step="0.5" />
    <p class="demo-result">
      {{ pick('当前价格：', 'Current price: ') }}{{ price }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(100%, 16rem);
}
.demo-result {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
