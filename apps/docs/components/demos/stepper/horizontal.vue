<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <div style="width: 100%; max-width: 640px">
    <Stepper
      :active-step="active"
      indicator-position="on-track"
      @step-click="active = $event"
    >
      <Step indicator="number" label="Workspace" :step="0" />
      <Step indicator="number" label="Team" :step="1" />
      <Step indicator="number" label="Integrations" :step="2" />
      <Step indicator="number" label="Import" :step="3" />
      <Step indicator="number" label="Launch" :step="4" />
    </Stepper>
  </div>
</template>
