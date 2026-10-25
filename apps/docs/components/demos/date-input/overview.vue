<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<template>
  <div style="width: 240px; max-width: 100%">
    <DateInput v-model="date" label="Start date" placeholder="Select a date" clearable />
  </div>
</template>
