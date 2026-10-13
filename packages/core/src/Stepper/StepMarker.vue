<script setup lang="ts">
import type { StepGlyph } from './logic.js'
import '../../styles/stepper.css'

defineOptions({ name: 'AstryxStepMarker' })

defineProps<{
  glyph: StepGlyph
  numberLabel: string
}>()
</script>

<template>
  <span v-if="glyph !== 'none'" class="astryx-step-indicator" :data-glyph="glyph" aria-hidden="true">
    <svg v-if="glyph === 'warning'" viewBox="0 0 16 16">
      <path d="M8 1.8 14.5 14H1.5L8 1.8z" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M8 6.2v4.2" stroke="currentColor" stroke-linecap="round" />
    </svg>
    <svg v-else-if="glyph === 'error'" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-linecap="round" />
    </svg>
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
