<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const small = shallowRef(true)
const medium = shallowRef(true)
</script>

<template>
  <div class="input-preview-stack">
    <CheckboxInput v-model="small" label="Small · 20px" size="sm" />
    <CheckboxInput v-model="medium" label="Medium · 24px" size="md" />
  </div>
</template>
