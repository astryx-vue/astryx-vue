<script setup lang="ts">
import { DateTimeInput } from '@astryx-vue/core/DateTimeInput'
import { Stack } from '@astryx-vue/core/Stack'
import { shallowRef } from 'vue'

const dateTime = shallowRef<string | null>(null)
</script>

<template>
  <Stack direction="vertical" width="100%" :max-width="400" style="min-width: 240px">
    <DateTimeInput v-model="dateTime" label="Meeting time" placeholder="Select a date" has-clear />
  </Stack>
</template>
