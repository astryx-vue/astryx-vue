<script setup lang="ts">
import type { StepGlyph } from './logic.js'
import type { StepStatus } from './types.js'
import Icon from '../Icon/Icon.vue'
import '../../styles/stepper.css'

defineOptions({ name: 'AstryxStepMarker' })

defineProps<{
  glyph: StepGlyph
  numberLabel: string
  status?: StepStatus
  isDisabled?: boolean
}>()
</script>

<template>
  <span v-if="glyph !== 'none'" class="astryx-step-indicator" :data-glyph="glyph" aria-hidden="true">
    <Icon v-if="glyph === 'warning' || glyph === 'error'" :icon="glyph" size="sm" :color="isDisabled ? 'disabled' : glyph" />
    <Icon v-else-if="glyph === 'check' && status === 'success'" icon="success" size="sm" :color="isDisabled ? 'disabled' : 'success'" />
    <svg v-else-if="glyph === 'check'" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M4.4 8.2 6.7 10.5 11.7 5.5" fill="none" stroke="var(--astryx-color-background-surface, #fff)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" />
    </svg>
    <svg v-else-if="glyph === 'ring'" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" stroke-width="1.5" />
      <circle cx="8" cy="8" r="2.25" fill="currentColor" />
    </svg>
    <span v-else>{{ numberLabel }}</span>
  </span>
</template>
