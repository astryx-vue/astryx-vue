<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { ref } from 'vue'

const selected = ref(new Date(2026, 3, 15))
</script>

<template>
  <Calendar v-model="selected" label="Calendar" />
</template>
