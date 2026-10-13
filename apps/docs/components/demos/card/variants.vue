<script setup lang="ts">
import type { CardVariant } from '@astryx-vue/core/Card'
import { Card } from '@astryx-vue/core/Card'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const variants: { variant: CardVariant, label: string, note: string }[] = [
  { variant: 'default', label: 'General', note: '4 tasks due today' },
  { variant: 'muted', label: 'Archived', note: 'No activity in 30 days' },
  { variant: 'blue', label: 'Engineering', note: '12 open issues' },
  { variant: 'green', label: 'Marketing', note: '3 campaigns active' },
  { variant: 'orange', label: 'Urgent', note: '2 items need review' },
  { variant: 'purple', label: 'Design', note: '5 drafts in progress' },
]
</script>

<template>
  <HStack :gap="3" wrap="wrap">
    <Card v-for="item in variants" :key="item.variant" :variant="item.variant" :width="160">
      <VStack :gap="1">
        <Text type="body" weight="bold">
          {{ item.label }}
        </Text>
        <Text type="supporting" color="secondary">
          {{ item.note }}
        </Text>
      </VStack>
    </Card>
  </HStack>
</template>
