<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const error = ref('sarah@')
const warning = ref('sarah_chen')
const success = ref('https://sarahchen.dev')
const errorOnly = ref('test')
const disabled = ref('')
const loading = ref('sarahc')
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="3">
      <TextInput
        v-model="error"
        label="Error message"
        placeholder="Enter a value"
        :status="{ type: 'error', message: 'Please enter a valid email address.' }"
      />
      <TextInput
        v-model="warning"
        label="Warning message"
        placeholder="Enter a value"
        :status="{ type: 'warning', message: 'This username is already taken — try adding a number.' }"
      />
      <TextInput
        v-model="success"
        label="Success message"
        placeholder="Enter a value"
        :status="{ type: 'success', message: 'URL is valid and reachable.' }"
      />
      <TextInput
        v-model="errorOnly"
        label="Status without message"
        placeholder="Enter a value"
        :status="{ type: 'error' }"
      />
      <TextInput v-model="disabled" label="Disabled field" placeholder="Enter a value" is-disabled />
      <TextInput v-model="loading" label="Loading field" is-loading />
    </VStack>
  </div>
</template>
