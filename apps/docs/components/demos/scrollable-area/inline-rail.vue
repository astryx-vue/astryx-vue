<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Link } from '@astryx-vue/core/Link'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const files = [
  { id: 'brief', title: 'Q3 launch brief', meta: 'Edited 2 days ago' },
  { id: 'pricing', title: 'Pricing rework', meta: 'Edited 3 days ago' },
  { id: 'onboarding', title: 'Onboarding flow v4', meta: 'Edited 4 days ago' },
  { id: 'macros', title: 'Support macros', meta: 'Edited last week' },
  { id: 'brand', title: 'Brand refresh', meta: 'Priya Raman' },
  { id: 'checkout', title: 'Checkout audit', meta: 'Tomas Lindqvist' },
  { id: 'partner', title: 'Partner deck', meta: 'Ines Okafor' },
]
</script>

<template>
  <Card :padding="4" :width="460">
    <VStack :gap="3">
      <HStack h-align="between" vAlign="center">
        <VStack :gap="0.5">
          <p class="layout-title layout-title--page">
            Workspace files
          </p>
          <Text type="supporting">
            Recently opened
          </Text>
        </VStack>
        <Link href="#files">
          View all
        </Link>
      </HStack>
      <ScrollableArea
        axis="inline"
        is-full-bleed
        label="Recently opened files"
        :padding-block-end="4"
        :padding-block-start="0.5"
        :padding-inline="4"
        role="region"
      >
        <HStack :gap="2">
          <Card v-for="file in files" :key="file.id" :padding="3" variant="muted" :width="170">
            <VStack :gap="1">
              <Text :max-lines="1" weight="medium">
                {{ file.title }}
              </Text>
              <Text :max-lines="1" type="supporting">
                {{ file.meta }}
              </Text>
            </VStack>
          </Card>
        </HStack>
      </ScrollableArea>
    </VStack>
  </Card>
</template>
