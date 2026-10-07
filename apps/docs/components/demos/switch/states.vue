<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const disabled = shallowRef(false)
const readOnly = shallowRef(true)
const locked = shallowRef(false)
</script>

<template>
  <div class="input-preview-grid">
    <Switch v-model="disabled" label="Disabled" is-disabled />
    <Switch v-model="readOnly" label="Read-only" is-read-only />
    <Switch v-model="locked" label="Locked" is-disabled disabled-message="You need the Admin role to change this." />
  </div>
</template>
