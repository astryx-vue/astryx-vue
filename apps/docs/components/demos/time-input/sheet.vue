<script setup lang="ts">
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const time = shallowRef<string | null>('14:30')
</script>

<template>
  <div style="width: 240px; max-width: 100%">
    <TimeInput
      v-model="time"
      label="Start"
      presentation="bottom-sheet"
    />
  </div>
</template>
