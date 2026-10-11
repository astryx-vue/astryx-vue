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
  { id: 'playwright', label: 'Playwright' },
  { id: 'eslint', label: 'ESLint' },
  { id: 'prettier', label: 'Prettier' },
  { id: 'vite', label: 'Vite' },
  { id: 'pnpm', label: 'pnpm' },
]
</script>

<template>
  <Card :padding="2" :width="340">
    <OverflowList :items="items" :max-rows="2" :max-visible-items="6">
      <template #item="{ item }">
        <Badge variant="info">
          {{ item.label }}
        </Badge>
      </template>
      <template #overflow="{ items: hidden }">
        <Badge>+{{ hidden.length }}</Badge>
      </template>
    </OverflowList>
  </Card>
</template>
