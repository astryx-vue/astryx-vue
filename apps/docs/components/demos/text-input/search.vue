<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const query = shallowRef('Design tokens')
const submitted = shallowRef('')
</script>

<template>
  <div class="input-preview-stack">
    <TextInput v-model="query" label="Search components" is-label-hidden has-clear placeholder="Search components…" @enter="submitted = query">
      <template #icon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
      </template>
    </TextInput>
    <p class="input-preview-note" aria-live="polite">
      {{ submitted ? `Search: ${submitted}` : 'Type a query and press Enter.' }}
    </p>
  </div>
</template>
