<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const value = ref<string | null>(null)
const options = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'].map(fruit => ({ value: fruit, label: fruit }))
</script>

<template>
  <Selector
    v-model="value"
    :width="300"
    label="Fruit"
    :options="options"
    placeholder="Select a fruit..."
  />
</template>
