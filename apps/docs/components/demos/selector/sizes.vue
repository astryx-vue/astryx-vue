<script setup lang="ts">
import { ref } from 'vue'
import { Selector } from '@astryx-vue/core/Selector'

const selected = ref<string | null>(null)
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
      size="sm"
      placeholder="Small"
    />
    <Selector
      v-model="selected"
      :options="options"
      size="md"
      placeholder="Medium"
    />
    <Selector
      v-model="selected"
      :options="options"
      size="lg"
      placeholder="Large"
    />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 20rem;
}
</style>
