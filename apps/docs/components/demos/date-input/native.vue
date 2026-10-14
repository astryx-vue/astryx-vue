<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core'
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

provideAstryxLocale('en')

const date = ref<Date | null>(new Date(2026, 2, 21))
</script>

<template>
  <div style="width: 100%; max-width: 360px">
    <DateInput
      v-model="date"
      label="System date"
      description="This field opens the browser date control."
      presentation="native"
      clearable
    />
  </div>
</template>
