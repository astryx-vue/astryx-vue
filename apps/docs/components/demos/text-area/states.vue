<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { TextArea } from '@astryx-vue/core/TextArea'
import { ref } from 'vue'

const requiredValue = ref('')
const disabledValue = ref('This field is disabled and cannot be edited.')
const loadingValue = ref('')
</script>

<template>
  <VStack :gap="4" width="100%" style="max-width: 400px">
    <TextArea v-model="requiredValue" label="Required field" placeholder="Describe the issue..." is-required />
    <TextArea v-model="disabledValue" label="Disabled field" is-disabled />
    <TextArea v-model="loadingValue" label="Loading field" placeholder="Generating summary..." is-loading />
  </VStack>
</template>
