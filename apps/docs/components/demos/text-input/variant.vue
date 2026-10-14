<script setup lang="ts">
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const attached = ref('sarah@')
const detached = ref('sarah@')
</script>

<template>
  <div style="width: 640px; max-width: 100%">
    <HStack :gap="5">
      <VStack :gap="2">
        <Text type="label">
          attached (default)
        </Text>
        <TextInput
          v-model="attached"
          label="Email"
          placeholder="you@example.com"
          status-variant="attached"
          :status="{ type: 'error', message: 'Please enter a valid email address.' }"
        />
        <Text type="supporting">
          Message overlaps directly below the input.
        </Text>
      </VStack>
      <VStack :gap="2">
        <Text type="label">
          detached
        </Text>
        <TextInput
          v-model="detached"
          label="Email"
          placeholder="you@example.com"
          status-variant="detached"
          :status="{ type: 'error', message: 'Please enter a valid email address.' }"
        />
        <Text type="supporting">
          Message floats below as a separate element with spacing.
        </Text>
      </VStack>
    </HStack>
  </div>
</template>
