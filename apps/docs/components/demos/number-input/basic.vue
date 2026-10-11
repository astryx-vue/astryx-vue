<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const count = ref(5)
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-container">
    <NumberInput v-model="count" :min="0" :max="100" />
    <p class="demo-result">
      {{ pick('当前值：', 'Current value: ') }}{{ count }}
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
