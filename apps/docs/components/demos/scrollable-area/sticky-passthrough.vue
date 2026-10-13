<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const shared = [
  { id: 'brand', title: 'Brand refresh', meta: 'Priya Raman' },
  { id: 'checkout', title: 'Checkout audit', meta: 'Tomas Lindqvist' },
  { id: 'partner', title: 'Partner deck', meta: 'Ines Okafor' },
  { id: 'research', title: 'Research synthesis', meta: 'Mei Watanabe' },
  { id: 'tax', title: 'Tax region notes', meta: 'Hugo Bernard' },
  { id: 'sso', title: 'SSO rollout plan', meta: 'Sofia Marchetti' },
]

const templates = [
  { id: 'weekly', title: 'Weekly report', meta: 'Used 24 times' },
  { id: 'checklist', title: 'Launch checklist', meta: 'Used 18 times' },
  { id: 'review', title: 'Design review', meta: 'Used 11 times' },
  { id: 'retro', title: 'Retro board', meta: 'Used 9 times' },
  { id: 'brief', title: 'Project brief', meta: 'Used 7 times' },
  { id: 'postmortem', title: 'Postmortem', meta: 'Used 4 times' },
]

const archived = [
  { id: 'roadmap', title: '2025 roadmap', meta: 'Archived in March' },
  { id: 'legacy', title: 'Legacy pricing', meta: 'Archived in March' },
  { id: 'kit', title: 'Old brand kit', meta: 'Archived in January' },
  { id: 'beta', title: 'Beta feedback', meta: 'Archived in January' },
  { id: 'survey', title: 'Q4 survey results', meta: 'Archived in January' },
  { id: 'offsite', title: 'Offsite agenda', meta: 'Archived last year' },
]
</script>

<template>
  <Card :padding="0" :width="400">
    <ScrollableArea axis="block" :height="300" label="Workspace files" :padding="4" role="region">
      <VStack :gap="0.5" :padding-block-end="2">
        <p class="layout-title layout-title--page">
          Workspace files
        </p>
        <Text type="supporting">
          18 files across 3 sections
        </Text>
      </VStack>
      <ScrollableArea axis="block" label="Shared with you">
        <div class="sticky-label">
          <Text color="secondary" type="label">
            Shared with you
          </Text>
        </div>
        <Grid :columns="2" :gap="2">
          <Card v-for="file in shared" :key="file.id" :padding="3" variant="muted">
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
      </ScrollableArea>
      <ScrollableArea axis="block" label="Templates" sticky-containment="always">
        <div class="sticky-label">
          <Text color="secondary" type="label">
            Templates
          </Text>
        </div>
        <Grid :columns="2" :gap="2">
          <Card v-for="file in templates" :key="file.id" :padding="3" variant="muted">
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
      </ScrollableArea>
      <div class="sticky-label">
        <Text color="secondary" type="label">
          Archived
        </Text>
      </div>
      <Grid :columns="2" :gap="2">
        <Card v-for="file in archived" :key="file.id" :padding="3" variant="muted">
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
    </ScrollableArea>
  </Card>
</template>
