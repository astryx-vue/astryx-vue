<script setup lang="ts">
import { DateTimeInput } from '@astryx-vue/core/DateTimeInput'
import { shallowRef } from 'vue'

const dateTime = shallowRef<string | null>(null)
</script>

<template>
  <div style="width: 400px; max-width: 100%">
    <DateTimeInput v-model="dateTime" label="Meeting time" placeholder="Select a date" has-clear />
  </div>
</template>
