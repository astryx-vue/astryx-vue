<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { Selector } from '@astryx-vue/core/Selector'
import { ref, useId } from 'vue'

const selected = ref<string | null>(null)
const inputId = `fruit-${useId()}`
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Field :input-id="inputId" label="Fruit">
    <Selector v-model="selected" label="Fruit" :options="options" placeholder="Select a fruit..." />
  </Field>
</template>
