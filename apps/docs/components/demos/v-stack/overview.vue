<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const groups = [
  { label: 'gap=2', gap: 2 },
  { label: 'gap=4', gap: 4 },
  { label: 'gap=6', gap: 6 },
] as const
</script>

<template>
  <HStack :gap="10">
    <VStack v-for="group in groups" :key="group.label" :gap="2">
      <Text type="supporting" color="secondary">
        {{ group.label }}
      </Text>
      <VStack :gap="group.gap">
        <Badge label="Step 1" />
        <Badge label="Step 2" />
        <Badge label="Step 3" />
      </VStack>
    </VStack>
  </HStack>
</template>
