<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const updates = shallowRef(true)
const tips = shallowRef(false)
</script>

<template>
  <div class="input-preview-stack">
    <CheckboxInput v-model="updates" label="Product updates" description="Receive a monthly summary of new features." />
    <CheckboxInput v-model="tips" label="Tips and tutorials" description="Learn new ways to use the product." />
  </div>
</template>
