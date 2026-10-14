<script setup lang="ts">
import type { CheckboxValue } from '@astryx-vue/core/CheckboxInput'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const error = ref<CheckboxValue>(false)
const warning = ref<CheckboxValue>(true)
const success = ref<CheckboxValue>(true)
</script>

<template>
  <VStack :gap="4">
    <CheckboxInput
      v-model="error"
      label="Error"
      description="Required field that has not been accepted."
      :status="{ type: 'error', message: 'You must accept the terms to continue' }"
    />
    <CheckboxInput
      v-model="warning"
      label="Warning"
      description="Enabled setting with a side effect to be aware of."
      :status="{ type: 'warning', message: 'This data may be shared with partners' }"
    />
    <CheckboxInput
      v-model="success"
      label="Success"
      description="Confirmed setting that has been verified."
      :status="{ type: 'success', message: 'Your email has been verified' }"
    />
  </VStack>
</template>
