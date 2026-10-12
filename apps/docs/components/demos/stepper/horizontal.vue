<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <div style="width: 100%; max-width: 600px">
    <Stepper :active-step="active" orientation="horizontal" @step-click="active = $event">
      <Step label="Workspace" :step="0" />
      <Step label="Team" :step="1" />
      <Step label="Integrations" :step="2" />
      <Step label="Import" :step="3" />
      <Step label="Launch" :step="4" />
    </Stepper>
  </div>
</template>
