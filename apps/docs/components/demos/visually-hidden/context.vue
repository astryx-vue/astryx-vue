<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'

const stats = [
  { label: 'Revenue', value: '$48.2k', delta: '+12%', direction: 'up' },
  { label: 'Churn', value: '2.1%', delta: '-4%', direction: 'down' },
] as const
</script>

<template>
  <HStack :gap="4" wrap="wrap">
    <Card v-for="item in stats" :key="item.label" variant="muted">
      <VStack :gap="1">
        <Text type="supporting" color="secondary">
          {{ item.label }}
        </Text>
        <Text type="display-3">
          {{ item.value }}
        </Text>
        <HStack :gap="1" align="center">
          <span
            class="css-icon css-icon--sm"
            :class="item.direction === 'up' ? 'i-carbon-arrow-up' : 'i-carbon-arrow-down'"
            aria-hidden="true"
          />
          <Text type="body">
            {{ item.delta }}
            <VisuallyHidden>
              {{ item.direction === 'up' ? ' increase' : ' decrease' }} from last month
            </VisuallyHidden>
          </Text>
        </HStack>
      </VStack>
    </Card>
  </HStack>
</template>
