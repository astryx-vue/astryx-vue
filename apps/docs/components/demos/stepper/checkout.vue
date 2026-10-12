<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <div style="width: 100%; max-width: 640px">
    <Stepper :active-step="active" indicator-position="on-track" orientation="horizontal" @step-click="active = $event">
      <Step indicator="number" label="Cart" :step="0" />
      <Step indicator="number" label="Shipping" :step="1" />
      <Step indicator="number" label="Payment" :step="2" />
      <Step indicator="number" label="Review" :step="3" />
      <Step indicator="number" label="Confirm" :step="4" />
    </Stepper>
  </div>
</template>
