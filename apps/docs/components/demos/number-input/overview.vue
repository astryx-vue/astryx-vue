<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const quantity = ref(0)
</script>

<template>
  <NumberInput
    v-model="quantity"
    label="Quantity"
    :min="0"
    :max="100"
    has-number-steppers
    :format-value="value => `${value} items`"
  />
</template>
