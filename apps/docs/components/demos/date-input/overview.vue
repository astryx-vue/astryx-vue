<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { Stack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<template>
  <Stack direction="vertical" width="100%" :max-width="400" style="min-width: 240px">
    <DateInput v-model="date" label="Start date" placeholder="Select a date" has-clear />
  </Stack>
</template>
