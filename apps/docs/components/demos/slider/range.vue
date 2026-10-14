<script setup lang="ts">
import { Slider } from '@astryx-vue/core/Slider'
import { ref } from 'vue'

const value = ref<[number, number]>([20, 80])
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <Slider v-model="value" label="Price range" />
  </div>
</template>
