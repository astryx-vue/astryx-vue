<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <Stepper
      :active-step="active"
      :horizontal-options="{ minimumStepWidth: 112 }"
      @step-click="active = $event"
    >
      <Step label="Cart" :step="0" />
      <Step description="Where it goes" label="Shipping" :step="1" />
      <Step label="Delivery" :step="2" />
      <Step label="Payment" :step="3" />
    </Stepper>
  </div>
</template>
