<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'

const items = [
  { name: 'astryx-core', status: 'Passing', variant: 'success' },
  { name: 'astryx-charts', status: 'Failing', variant: 'error' },
  { name: 'astryx-cli', status: 'Passing', variant: 'success' },
] as const
</script>

<template>
  <VStack :gap="3" h-align="start">
    <Text type="supporting" color="secondary">
      The layout makes this group obvious to sighted users. A hidden heading gives screen-reader users the same landmark to jump to.
    </Text>
    <VisuallyHidden as="h2">
      Build status
    </VisuallyHidden>
    <VStack :gap="2">
      <Card v-for="item in items" :key="item.name" variant="muted" :padding="3">
        <HStack :gap="3" align="center">
          <Text type="body">
            {{ item.name }}
          </Text>
          <Badge :variant="item.variant">
            {{ item.status }}
          </Badge>
        </HStack>
      </Card>
    </VStack>
  </VStack>
</template>
