<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <Stepper :active-step="active" @step-click="active = $event">
    <Step label="Cart" :step="0" />
    <Step label="Shipping" :step="1" />
    <Step label="Payment" :step="2" />
  </Stepper>
</template>
