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
      <VStack :gap="4">
        <VStack :gap="0.5">
          <p class="layout-title layout-title--page">
            Workspace files
          </p>
          <Text type="supporting">
            Two sections, two edge policies
          </Text>
        </VStack>
        <VStack :gap="2">
          <Text color="secondary" type="label">
            Shared with you
          </Text>
          <ScrollableArea axis="block" class="section-frame" :height="150" label="Shared with you" :padding="2">
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
          <Text type="supporting">
            Scroll past the end and the panel keeps going.
          </Text>
        </VStack>
        <VStack :gap="2">
          <Text color="secondary" type="label">
            Archived
          </Text>
          <ScrollableArea axis="block" class="section-frame" :height="150" label="Archived" overscroll="contain" :padding="2">
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
          <Text type="supporting">
            Scroll past the end and the panel stays where it is.
          </Text>
        </VStack>
      </VStack>
    </ScrollableArea>
  </Card>
</template>
