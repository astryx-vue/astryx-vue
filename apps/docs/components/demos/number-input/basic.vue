<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput } from '@astryx-vue/core/NumberInput'

const count = ref(5)
</script>

<template>
  <div class="demo-container">
    <NumberInput v-model="count" :min="0" :max="100" />
    <p class="demo-result">
      当前值：{{ count }}
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
