<script setup lang="ts">
import { RadioGroup } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const selected = shallowRef('b')
</script>

<template>
  <div class="input-preview-grid">
    <RadioGroup v-model="selected" label="Disabled option" :options="[{ value: 'a', label: 'Available' }, { value: 'b', label: 'Unavailable', isDisabled: true }]" />
  </div>
</template>
