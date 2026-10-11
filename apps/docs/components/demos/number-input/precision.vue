<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput } from '@astryx-vue/core/NumberInput'

const price = ref(99.99)
</script>

<template>
  <div class="demo-container">
    <NumberInput v-model="price" :precision="2" :step="0.1" :min="0" />
    <p class="demo-result">
      价格：¥{{ price.toFixed(2) }}
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
