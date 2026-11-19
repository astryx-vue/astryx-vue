<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { Heading } from '@astryx-vue/core/Heading'
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
  <Card :width="380" :padding="0">
    <!-- 标题放在视口里，跟着内容一起滚走，而不是固定在上面。 -->
    <ScrollableArea axis="block" role="region" label="Workspace files" :height="300" :padding="4">
      <VStack :gap="4">
        <VStack :gap="0.5">
          <Heading :level="3">
            Workspace files
          </Heading>
          <Text type="supporting">
            12 files across 3 sections
          </Text>
        </VStack>
        <VStack v-for="section in sections" :key="section.label" :gap="2">
          <Text type="label" color="secondary">
            {{ section.label }}
          </Text>
          <Grid :columns="2" :gap="2">
            <Card v-for="file in section.files" :key="file.id" variant="muted" :padding="3">
              <VStack :gap="1">
                <Text weight="medium" :max-lines="1">
                  {{ file.title }}
                </Text>
                <Text type="supporting" :max-lines="1">
                  {{ file.meta }}
                </Text>
              </VStack>
            </Card>
          </Grid>
        </VStack>
      </VStack>
    </ScrollableArea>
  </Card>
</template>
