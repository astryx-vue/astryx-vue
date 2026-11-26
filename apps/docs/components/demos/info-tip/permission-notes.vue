<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const fields = [
  { name: 'Owner', value: 'Design Systems', note: 'Only admins can change the owner.' },
  { name: 'Visibility', value: 'Everyone in the workspace', note: 'Editors can change this field; viewers cannot.' },
]
</script>

<template>
  <VStack :gap="4">
    <VStack v-for="field in fields" :key="field.name" :gap="1">
      <HStack :gap="1" align="center">
        <Text type="label">
          {{ field.name }}
        </Text>
        <InfoTip :content="field.note" :label="`Who can change ${field.name.toLowerCase()}`" />
      </HStack>
      <Text type="body" color="secondary">
        {{ field.value }}
      </Text>
    </VStack>
  </VStack>
</template>
