<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <div style="width: 100%; max-width: 640px">
    <Stepper
      :active-step="active"
      :horizontal-options="{ minimumStepWidth: 112 }"
      @step-click="active = $event"
    >
      <Step label="Cart" :step="0" />
      <Step label="Shipping" :step="1" />
      <Step label="Payment" :step="2" />
      <Step label="Review" :step="3" />
      <Step label="Confirm" :step="4" />
    </Stepper>
  </div>
</template>
