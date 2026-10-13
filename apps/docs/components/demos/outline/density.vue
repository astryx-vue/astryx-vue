<script setup lang="ts">
import type { OutlineItem } from '@astryx-vue/core/Outline'
import { Outline } from '@astryx-vue/core/Outline'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const items: OutlineItem[] = [
  { id: 'density-getting-started', label: 'Getting started', level: 2 },
  { id: 'density-configuration', label: 'Configuration', level: 2 },
  { id: 'density-api', label: 'API reference', level: 3 },
  { id: 'density-examples', label: 'Examples', level: 3 },
  { id: 'density-faq', label: 'FAQ', level: 2 },
]
</script>

<template>
  <HStack :gap="10" align="start">
    <VStack :gap="3" :width="200">
      <Text type="supporting" color="secondary" weight="medium">
        Default
      </Text>
      <Outline :items="items" density="default" active-id="density-configuration" />
    </VStack>
    <VStack :gap="3" :width="200">
      <Text type="supporting" color="secondary" weight="medium">
        Compact
      </Text>
      <Outline :items="items" density="compact" active-id="density-configuration" />
    </VStack>
  </HStack>
</template>
