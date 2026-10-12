<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <Stepper :active-step="active" indicator-position="on-track" @step-click="active = $event">
    <Step indicator="number" label="Cart" :step="0" />
    <Step indicator="number" label="Shipping" :step="1" />
    <Step indicator="number" label="Payment" :step="2" />
  </Stepper>
</template>
