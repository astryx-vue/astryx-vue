<script setup lang="ts">
import { Radio, RadioGroup } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const size = shallowRef('md')
</script>

<template>
  <div class="input-preview-grid">
    <RadioGroup v-model="size" label="Size">
      <Radio value="sm" label="Small" />
      <Radio value="md" label="Medium" />
      <Radio value="lg" label="Large" />
    </RadioGroup>
  </div>
</template>
