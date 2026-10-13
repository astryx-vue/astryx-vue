<script setup lang="ts">
import type { StatusDotVariant } from '@astryx-vue/core/StatusDot'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { StatusDot } from '@astryx-vue/core/StatusDot'
import { Text } from '@astryx-vue/core/Text'

const statuses: { variant: StatusDotVariant, label: string }[] = [
  { variant: 'success', label: 'Online' },
  { variant: 'warning', label: 'Away' },
  { variant: 'error', label: 'Offline' },
  { variant: 'neutral', label: 'Unknown' },
]
</script>

<template>
  <VStack :gap="2">
    <HStack v-for="item in statuses" :key="item.variant" :gap="2" align="center">
      <StatusDot :variant="item.variant" :label="item.label" />
      <Text type="body">
        {{ item.label }}
      </Text>
    </HStack>
  </VStack>
</template>
