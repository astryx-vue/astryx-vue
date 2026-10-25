<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

const date = ref<Date | null>(new Date(2026, 2, 21))
</script>

<template>
  <div style="width: 240px; max-width: 100%">
    <DateInput
      v-model="date"
      label="Due"
      description="Opens a one-month sheet. Save closes it."
      presentation="bottom-sheet"
    />
  </div>
</template>
