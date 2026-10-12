<script setup lang="ts">
import { TimeInput } from '@astryx-vue/core/TimeInput'
import { shallowRef } from 'vue'

const evening = shallowRef<string | null>(null)
</script>

<template>
  <TimeInput
    v-model="evening"
    label="Dinner reservation"
    min="17:00"
    max="22:00"
    description="Evening seating: 5 PM – 10 PM"
    placeholder="Select reservation time"
    presentation="adaptive-bottom-sheet"
    has-clear
  />
</template>
