<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const bio = shallowRef('Ada Lovelace is widely considered the first computer programmer.')
</script>

<template>
  <div class="input-preview-grid">
    <TextArea v-model="bio" label="Bio" description="A short introduction." is-required required-label="Required" html-name="bio" />
  </div>
</template>
