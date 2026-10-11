<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { Field } from '@astryx-vue/core/Field'
import { ref, useId } from 'vue'

const date = ref<Date | null>(null)
const inputId = `start-date-${useId()}`
</script>

<template>
  <Field :input-id="inputId" label="Start date">
    <DateInput v-model="date" label="Start date" placeholder="Select a date" />
  </Field>
</template>
