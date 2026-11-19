<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <div style="width: 100%; max-width: 640px">
    <Stepper :active-step="active" orientation="horizontal" @step-click="active = $event">
      <Step :step="0" label="Cart" />
      <Step :step="1" label="Shipping" />
      <Step :step="2" label="Payment" />
      <Step :step="3" label="Review" />
      <Step :step="4" label="Confirm" />
    </Stepper>
  </div>
</template>
