<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Card } from '@astryx-vue/core/Card'
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'stylex', label: 'StyleX' },
  { id: 'storybook', label: 'Storybook' },
  { id: 'vitest', label: 'Vitest' },
]
const variants = {
  react: 'info',
  typescript: 'success',
  stylex: 'warning',
  storybook: 'neutral',
  vitest: 'error',
} as const
</script>

<template>
  <Card :padding="2" :width="300">
    <OverflowList :items="items" :max-visible-items="3">
      <template #item="{ item }">
        <Badge :variant="variants[item.id as keyof typeof variants]">
          {{ item.label }}
        </Badge>
      </template>
      <template #overflow="{ items: hidden }">
        <Badge>+{{ hidden.length }}</Badge>
      </template>
    </OverflowList>
  </Card>
</template>
