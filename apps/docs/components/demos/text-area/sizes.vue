<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const sm = shallowRef('Small size.')
const md = shallowRef('Medium size.')
const lg = shallowRef('Large size.')
</script>

<template>
  <div class="input-preview-grid">
    <TextArea v-model="sm" label="Small" size="sm" />
    <TextArea v-model="md" label="Medium" size="md" />
    <TextArea v-model="lg" label="Large" size="lg" />
  </div>
</template>
