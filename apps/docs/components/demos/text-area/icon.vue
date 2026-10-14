<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="width: 400px; max-width: 100%">
    <TextArea
      v-model="value"
      label="Meeting notes"
      description="Capture key decisions and action items."
      placeholder="What was discussed?"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
        </svg>
      </template>
    </TextArea>
  </div>
</template>
