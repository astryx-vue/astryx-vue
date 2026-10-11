<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const value = ref(10)
</script>

<template>
  <div class="demo-container">
    <NumberInput v-model="value" size="sm" />
    <NumberInput v-model="value" size="md" />
    <NumberInput v-model="value" size="lg" />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(100%, 20rem);
}
</style>
