<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(3)
</script>

<template>
  <div style="width: 100%; max-width: 420px">
    <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
      <Step description="you@example.com" label="Email verified" :step="0" status="success" />
      <Step description="+1 (555) 012-3456" label="Phone verified" :step="1" status="success" />
      <Step description="Passport upload failed" label="Identity document" :step="2" status="error" />
      <Step description="Pending review" label="Address verification" :step="3" status="accent" />
      <Step description="Skipped" is-optional label="Background check" :step="4" />
      <Step label="Account activated" :step="5" />
    </Stepper>
  </div>
</template>
