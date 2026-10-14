<script setup lang="ts">
import type { IconColor } from '@astryx-vue/core/Icon'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const statuses: { name: string, color: IconColor, label: string }[] = [
  { name: 'carbon:checkmark-filled', color: 'success', label: 'Deployed successfully' },
  { name: 'carbon:warning', color: 'warning', label: 'Build has warnings' },
  { name: 'carbon:error', color: 'error', label: 'Pipeline failed' },
  { name: 'carbon:information', color: 'accent', label: 'New version available' },
]
</script>

<template>
  <VStack :gap="3">
    <HStack v-for="status in statuses" :key="status.label" align="center" :gap="2">
      <Icon :name="status.name" :color="status.color" size="sm" />
      <Text type="body">
        {{ status.label }}
      </Text>
    </HStack>
  </VStack>
</template>
