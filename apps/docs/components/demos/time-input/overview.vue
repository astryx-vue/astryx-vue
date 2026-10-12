<script setup lang="ts">
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const time = shallowRef<string | null>(null)
</script>

<template>
  <TimeInput v-model="time" label="Time" placeholder="Select a time" />
</template>
