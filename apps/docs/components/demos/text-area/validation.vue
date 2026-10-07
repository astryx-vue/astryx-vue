<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const summary = shallowRef('')
</script>

<template>
  <div class="input-preview-grid">
    <TextArea v-model="summary" label="Summary" :status="{ type: 'error', message: 'Summary must be at least 20 characters.' }" />
  </div>
</template>
