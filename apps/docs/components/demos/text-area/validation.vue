<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextArea } from '@astryx-vue/core/TextArea'
import { ref } from 'vue'

const errorValue = ref('Fix the')
const warningValue = ref('Summarize the Q2 results')
const successValue = ref('Redesign the onboarding flow to reduce drop-off by 15% in Q3. Focus on simplifying the account creation step and adding a progress indicator.')
const errorNoMsgValue = ref('Invalid content')
</script>

<template>
  <VStack :gap="4" width="100%" style="max-width: 400px">
    <TextArea
      v-model="errorValue"
      label="Error message"
      :status="{ type: 'error', message: 'Description must be at least 20 characters.' }"
    />
    <TextArea
      v-model="warningValue"
      label="Warning message"
      :status="{ type: 'warning', message: 'Consider adding more detail for clarity.' }"
    />
    <TextArea
      v-model="successValue"
      label="Success message"
      :status="{ type: 'success', message: 'Looks good — clear and actionable.' }"
    />
    <TextArea
      v-model="errorNoMsgValue"
      label="Error without message"
      :status="{ type: 'error' }"
    />
  </VStack>
</template>
