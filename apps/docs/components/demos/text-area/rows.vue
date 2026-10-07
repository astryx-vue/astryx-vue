<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const reply = shallowRef('')
</script>

<template>
  <div class="input-preview-grid">
    <TextArea v-model="reply" label="Reply" :rows="4" :cols="40" :maxlength="140" description="Maximum 140 characters." />
  </div>
</template>
