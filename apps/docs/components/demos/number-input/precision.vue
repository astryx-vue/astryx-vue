<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput } from '@astryx-vue/core/NumberInput'

const price = ref(9.5)
</script>

<template>
  <div class="demo-container">
    <NumberInput v-model="price" label="价格" :min="0" :max="20" :step="0.5" />
    <p class="demo-result">
      当前价格：{{ price }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 16rem;
}
.demo-result {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
