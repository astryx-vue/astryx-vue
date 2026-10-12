<script setup lang="ts">
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const slot = shallowRef('09:00')
</script>

<template>
  <TimeInput
    v-model="slot"
    label="Appointment slot"
    :increment="15"
    description="Use arrow keys to change by 15 minutes"
    has-clear
  />
</template>
