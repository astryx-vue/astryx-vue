<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const time = shallowRef<string | null>(null)
</script>

<template>
  <Stack direction="vertical" width="100%" class="time-input-overview">
    <TimeInput v-model="time" label="Time" placeholder="Select a time" />
  </Stack>
</template>

<style scoped>
.time-input-overview {
  min-width: 240px;
  max-width: 400px;
}
</style>
