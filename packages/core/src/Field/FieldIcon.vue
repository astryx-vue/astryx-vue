<script setup lang="ts">
import type { FieldStatusType } from './types.js'

defineProps<{ type: FieldStatusType | 'info' | 'clear' }>()
</script>

<template>
  <svg class="astryx-field-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="type === 'clear'">
      <path d="m4 4 8 8M12 4l-8 8" />
    </template>
    <template v-else-if="type === 'warning'">
      <path d="M8 2 1.5 13h13L8 2Z" />
      <path d="M8 6v3m0 2v.1" />
    </template>
    <template v-else>
      <circle cx="8" cy="8" r="6" />
      <path v-if="type === 'success'" d="m5 8 2 2 4-4" />
      <path v-else-if="type === 'error'" d="M8 4.5v4m0 3v.1" />
      <path v-else d="M8 7v4m0-7v.1" />
    </template>
  </svg>
</template>
