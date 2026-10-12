<script setup lang="ts">
import { RadioList } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const plan = shallowRef('team')
const options = [
  { value: 'free', label: 'Free', description: 'For personal projects.' },
  { value: 'team', label: 'Team', description: 'For small teams.' },
  { value: 'enterprise', label: 'Enterprise', description: 'For organizations.' },
]
</script>

<template>
  <div class="input-preview-grid">
    <RadioList v-model="plan" label="Plan" :options="options" />
  </div>
</template>
