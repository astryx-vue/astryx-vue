<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const sm = shallowRef(false)
const md = shallowRef(false)
const lg = shallowRef(false)
</script>

<template>
  <div class="input-preview-grid">
    <Switch v-model="sm" label="Small" size="sm" />
    <Switch v-model="md" label="Medium" size="md" />
    <Switch v-model="lg" label="Large" size="lg" />
  </div>
</template>
