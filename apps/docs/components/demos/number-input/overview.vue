<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const value = ref<number | null>(0)
</script>

<template>
  <div style="width: 300px">
    <NumberInput
      v-model="value"
      label="Quantity"
      placeholder="Enter quantity"
      :format-value="number => `${number} items`"
      has-number-steppers
    />
  </div>
</template>
