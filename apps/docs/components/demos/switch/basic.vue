<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const enabled = shallowRef(true)
</script>

<template>
  <div class="input-preview-grid">
    <Switch v-model="enabled" label="Notifications" description="Receive email updates." />
  </div>
</template>
