<script setup lang="ts">
import { DateTimeInput } from '@astryx-vue/core/DateTimeInput'
import { shallowRef } from 'vue'

const meeting = shallowRef<string | null>('2026-03-21T14:30')
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <DateTimeInput
      v-model="meeting"
      label="Meeting"
      presentation="bottom-sheet"
      has-clear
    />
  </div>
</template>
