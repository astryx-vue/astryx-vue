<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const value = ref<number | null>(3)
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <NumberInput
      v-model="value"
      label="Team Size"
      placeholder="1–50"
      :min="1"
      :max="50"
      description="Number of people on the team"
    />
  </div>
</template>
