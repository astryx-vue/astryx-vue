<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { ref } from 'vue'

provideAstryxLocale('en')

const selected = ref(new Date(2026, 3, 15))
</script>

<template>
  <Calendar v-model="selected" label="Calendar" />
</template>
