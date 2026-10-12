<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(3)
</script>

<template>
  <div style="width: 100%; max-width: 400px">
    <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
      <Step description="you@example.com" label="Email verified" status="success" :step="0" />
      <Step description="+1 (555) 012-3456" label="Phone verified" status="success" :step="1" />
      <Step description="Passport upload failed" label="Identity document" status="error" :step="2" />
      <Step description="Pending review" label="Address verification" status="accent" :step="3" />
      <Step description="Skipped" is-optional label="Background check" :step="4" />
      <Step label="Account activated" :step="5" />
    </Stepper>
  </div>
</template>
