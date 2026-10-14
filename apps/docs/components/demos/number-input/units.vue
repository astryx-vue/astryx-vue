<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const value = ref<number | null>(50)
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <NumberInput
      v-model="value"
      label="Discount"
      placeholder="Enter discount"
      :min="0"
      :max="100"
      units="%"
    />
  </div>
</template>
