<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'
import { useLocalizedOptions } from '../../demo-infra/useDemoText'

const selected = ref<string | null>(null)
const options = useLocalizedOptions([
  { value: 'apple', zh: '苹果', en: 'Apple' },
  { value: 'banana', zh: '香蕉', en: 'Banana' },
  { value: 'cherry', zh: '樱桃', en: 'Cherry' },
])
</script>

<template>
  <div class="demo-container">
    <Selector v-model="selected" :options="options" size="sm" placeholder="Small" />
    <Selector v-model="selected" :options="options" size="md" placeholder="Medium" />
    <Selector v-model="selected" :options="options" size="lg" placeholder="Large" />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
