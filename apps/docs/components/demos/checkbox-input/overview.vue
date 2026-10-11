<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const updates = shallowRef(true)
const tips = shallowRef(false)
</script>

<template>
  <div class="overview-fill">
    <CheckboxInput v-model="updates" label="Product updates" />
    <CheckboxInput v-model="tips" label="Tips and tutorials" />
  </div>
</template>
