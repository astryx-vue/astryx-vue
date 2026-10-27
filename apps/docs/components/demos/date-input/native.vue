<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

const date = ref<Date | null>(new Date(2026, 2, 21))
</script>

<template>
  <div style="width: 240px; max-width: 100%">
    <DateInput
      v-model="date"
      label="System date"
      description="This field opens the browser date control."
      presentation="native"
      clearable
    />
  </div>
</template>
