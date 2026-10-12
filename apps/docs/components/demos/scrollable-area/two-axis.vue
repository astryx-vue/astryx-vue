<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const columns = [
  {
    label: 'Recently opened',
    files: [
      { id: 'brief', title: 'Q3 launch brief', meta: 'Edited 2 days ago' },
      { id: 'pricing', title: 'Pricing rework', meta: 'Edited 3 days ago' },
      { id: 'onboarding', title: 'Onboarding flow v4', meta: 'Edited 4 days ago' },
      { id: 'macros', title: 'Support macros', meta: 'Edited last week' },
    ],
  },
  {
    label: 'Shared with you',
    files: [
      { id: 'brand', title: 'Brand refresh', meta: 'Priya Raman' },
      { id: 'checkout', title: 'Checkout audit', meta: 'Tomas Lindqvist' },
      { id: 'partner', title: 'Partner deck', meta: 'Ines Okafor' },
      { id: 'research', title: 'Research synthesis', meta: 'Mei Watanabe' },
    ],
  },
  {
    label: 'Templates',
    files: [
      { id: 'weekly', title: 'Weekly report', meta: 'Used 24 times' },
      { id: 'checklist', title: 'Launch checklist', meta: 'Used 18 times' },
      { id: 'review', title: 'Design review', meta: 'Used 11 times' },
      { id: 'retro', title: 'Retro board', meta: 'Used 9 times' },
    ],
  },
  {
    label: 'Archived',
    files: [
      { id: 'roadmap', title: '2025 roadmap', meta: 'Archived in March' },
      { id: 'legacy', title: 'Legacy pricing', meta: 'Archived in March' },
      { id: 'kit', title: 'Old brand kit', meta: 'Archived in January' },
      { id: 'beta', title: 'Beta feedback', meta: 'Archived in January' },
    ],
  },
]
</script>

<template>
  <Card :padding="0" :width="420">
    <ScrollableArea axis="both" :height="300" label="Workspace board" :padding="4" role="region">
      <VStack :gap="4">
        <VStack :gap="0.5">
          <p class="layout-title layout-title--page">
            Workspace board
          </p>
          <Text type="supporting">
            16 files across 4 sections
          </Text>
        </VStack>
        <HStack :gap="3" align="start">
          <VStack v-for="column in columns" :key="column.label" :gap="2" :width="180">
            <Text color="secondary" type="label">
              {{ column.label }}
            </Text>
            <Card v-for="file in column.files" :key="file.id" :padding="3" variant="muted">
              <VStack :gap="1">
                <Text :max-lines="1" weight="medium">
                  {{ file.title }}
                </Text>
                <Text :max-lines="1" type="supporting">
                  {{ file.meta }}
                </Text>
              </VStack>
            </Card>
          </VStack>
        </HStack>
      </VStack>
    </ScrollableArea>
  </Card>
</template>
