<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const value = ref<number | null>(75)
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <NumberInput v-model="value" label="Progress" units="%" :min="0" :max="100" clearable />
  </div>
</template>
