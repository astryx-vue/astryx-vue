<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const sections = [
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
  <Card :padding="0" :width="380">
    <ScrollableArea axis="block" :height="300" label="Workspace files" :padding="4" role="region">
      <VStack :gap="0.5" :padding-block-end="2">
        <p class="layout-title layout-title--page">
          Workspace files
        </p>
        <Text type="supporting">
          12 files across 3 sections
        </Text>
      </VStack>
      <section v-for="section in sections" :key="section.label">
        <div class="sticky-label">
          <Text color="secondary" type="label">
            {{ section.label }}
          </Text>
        </div>
        <Grid :columns="2" :gap="2">
          <Card v-for="file in section.files" :key="file.id" :padding="3" variant="muted">
            <VStack :gap="1">
              <Text :max-lines="1" weight="medium">
                {{ file.title }}
              </Text>
              <Text :max-lines="1" type="supporting">
                {{ file.meta }}
              </Text>
            </VStack>
          </Card>
        </Grid>
      </section>
    </ScrollableArea>
  </Card>
</template>
