<script setup lang="ts">
import type { FieldStatusInput } from '@astryx-vue/core/Field'
import { Field } from '@astryx-vue/core/Field'
import { Stack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, shallowRef } from 'vue'

const email = shallowRef('')
const status = computed<FieldStatusInput | undefined>(() =>
  email.value.length > 0 && !email.value.includes('@')
    ? { type: 'error', message: 'Enter a valid email address.' }
    : undefined,
)
</script>

<template>
  <Stack direction="vertical" :gap="3" :width="320">
    <Field
      label="Email"
      input-id="field-email"
      description="We will never share your email."
      is-required
      :status="status"
    >
      <TextInput
        v-model="email"
        label="Email"
        is-label-hidden
        placeholder="you@example.com"
      />
    </Field>
  </Stack>
</template>
