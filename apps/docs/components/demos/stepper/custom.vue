<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { VStack } from '@astryx-vue/core/Stack'
import { Step, Stepper } from '@astryx-vue/core/Stepper'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const active = ref(0)
const name = ref('')
const repository = ref('')
</script>

<template>
  <div style="width: 100%; max-width: 420px">
    <Stepper :active-step="active" orientation="vertical" @step-click="active = $event">
      <Step description="Name it and point us at the source" label="Project details" :step="0">
        <VStack v-if="active === 0" :gap="3">
          <TextInput v-model="name" label="Project name" />
          <TextInput v-model="repository" label="Repository URL" />
          <Button label="Continue" variant="primary" @click="active = 1" />
        </VStack>
      </Step>
      <Step description="What we detected from your default branch" label="Review the build" :step="1">
        <Text v-if="active === 1" color="secondary" type="body">
          847 modules compiled, no warnings.
        </Text>
      </Step>
      <Step description="Ships to production" label="Deploy" :step="2" />
      <Step label="Live" :step="3" />
    </Stepper>
  </div>
</template>
