<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref, useId } from 'vue'

const quantity = ref(0)
const inputId = `quantity-${useId()}`
</script>

<template>
  <Field :input-id="inputId" label="Quantity">
    <NumberInput v-model="quantity" :min="0" :max="100" label="Quantity" />
  </Field>
</template>
