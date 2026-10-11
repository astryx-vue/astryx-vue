<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { shallowRef, useId } from 'vue'

const name = shallowRef('Ada')
const inputId = `name-${useId()}`
</script>

<template>
  <Field :input-id="inputId" label="Name" description="How we should address you.">
    <template #default="field">
      <input
        :id="field.inputId"
        v-model="name"
        class="input-preview-native"
        :aria-labelledby="field.labelId"
        :aria-describedby="field.describedBy"
      >
    </template>
  </Field>
</template>
