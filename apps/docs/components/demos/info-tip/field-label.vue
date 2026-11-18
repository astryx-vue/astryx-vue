<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div class="input-preview-grid">
    <TextInput v-model="name" label="Workspace name" label-tooltip="Shown to everyone in the workspace." />
  </div>
</template>
