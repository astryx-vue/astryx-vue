<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const described = ref('')
const password = ref('hunter42')
const email = ref('sarah@example.com')
const tooltip = ref('')
const required = ref('')
const optional = ref('')
</script>

<template>
  <div style="width: 300px; max-width: 100%">
    <VStack :gap="3">
      <TextInput
        v-model="described"
        label="Default field"
        placeholder="Enter your email"
        description="Descriptions can be used to provide additional information about a field."
      />
      <TextInput v-model="password" type="password" label="Password field" placeholder="Enter a value" />
      <TextInput v-model="email" type="email" label="Email field" placeholder="Enter a value" />
      <TextInput
        v-model="tooltip"
        label="Field tooltip"
        placeholder="Enter your API key"
        label-tooltip="Your unique API key for authentication. Keep this secret!"
      />
      <TextInput v-model="required" label="Required field" placeholder="Enter your username" is-required />
      <TextInput v-model="optional" label="Optional field" placeholder="Enter your nickname" is-optional />
    </VStack>
  </div>
</template>
