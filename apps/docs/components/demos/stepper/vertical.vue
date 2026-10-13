<script setup lang="ts">
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { ref } from 'vue'

const active = ref(2)
</script>

<template>
  <div style="width: 100%; max-width: 400px">
    <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
      <Step description="Name and configure your workspace" label="Create workspace" :step="0" />
      <Step description="Add collaborators by email" label="Invite team members" :step="1" />
      <Step description="Connect Slack, GitHub, Jira" label="Set up integrations" :step="2" />
      <Step description="Bring in existing projects" label="Import data" :step="3" />
      <Step description="Go live with your team" label="Launch" :step="4" />
    </Stepper>
  </div>
</template>
